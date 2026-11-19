import os
from uuid import UUID

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
supabase: Client | None = (
    create_client(supabase_url, supabase_key)
    if supabase_url and supabase_key
    else None
)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Events API"})


@app.route("/api/events", methods=["GET"])
def list_events():
    try:
        query = supabase.table("events").select("*")
        status = request.args.get("status")
        if status:
            query = query.eq("status", status)
        response = query.execute()
        return jsonify(response.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.route("/api/events/<event_id>", methods=["GET"])
def get_event(event_id):
    if not valid_uuid(event_id):
        return jsonify({"error": "Invalid event id"}), 400
    try:
        response = supabase.table("events").select("*").eq("id", event_id).limit(1).execute()
        if not response.data:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(response.data[0]), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.route("/api/registrations", methods=["POST"])
def create_registration():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    event_id = data.get("event_id")
    if not valid_uuid(user_id) or not valid_uuid(event_id):
        return jsonify({"error": "user_id and event_id must be valid UUIDs"}), 400

    try:
        event_response = (
            supabase.table("events").select("id, capacity, status")
            .eq("id", event_id).limit(1).execute()
        )
        if not event_response.data:
            return jsonify({"error": "Event not found"}), 404
        event = event_response.data[0]
        if event.get("status") != "open":
            return jsonify({"error": "Event is not open for registration"}), 409

        existing = (
            supabase.table("registrations").select("id")
            .eq("user_id", user_id).eq("event_id", event_id).limit(1).execute()
        )
        if existing.data:
            return jsonify({"error": "Already registered"}), 409

        registrations = (
            supabase.table("registrations").select("id")
            .eq("event_id", event_id).execute()
        )
        capacity = event.get("capacity")
        if capacity is not None and len(registrations.data) >= capacity:
            return jsonify({"error": "Event is full"}), 409

        created = supabase.table("registrations").insert(
            {"user_id": user_id, "event_id": event_id}
        ).execute()
        return jsonify(created.data[0]), 201
    except APIError as error:
        # Unique-constraint conflicts commonly indicate a duplicate registration.
        if getattr(error, "code", None) == "23505":
            return jsonify({"error": "Already registered"}), 409
        return jsonify({"error": error.message}), 500


@app.route("/api/me/registrations", methods=["GET"])
def list_user_registrations():
    user_id = request.args.get("user_id")
    if not valid_uuid(user_id):
        return jsonify({"error": "A valid user_id query parameter is required"}), 400
    try:
        response = (
            supabase.table("registrations")
            .select("*, events(*)")
            .eq("user_id", user_id)
            .execute()
        )
        return jsonify(response.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


@app.route("/api/events/<event_id>/registrations", methods=["GET"])
def list_event_registrations(event_id):
    organizer_id = request.args.get("organizer_id")
    if not valid_uuid(event_id) or not valid_uuid(organizer_id):
        return jsonify({"error": "Valid event_id and organizer_id are required"}), 400
    try:
        event_response = (
            supabase.table("events").select("organizer_id")
            .eq("id", event_id).limit(1).execute()
        )
        if not event_response.data:
            return jsonify({"error": "Event not found"}), 404
        if event_response.data[0].get("organizer_id") != organizer_id:
            return jsonify({"error": "Only the event organizer can view registrations"}), 403

        response = (
            supabase.table("registrations")
            .select("*, users(id, email, role)")
            .eq("event_id", event_id)
            .execute()
        )
        return jsonify(response.data), 200
    except APIError as error:
        return jsonify({"error": error.message}), 500


def valid_uuid(value):
    if not isinstance(value, str):
        return False
    try:
        UUID(value)
        return True
    except ValueError:
        return False


if __name__ == "__main__":
    app.run(debug=True)
