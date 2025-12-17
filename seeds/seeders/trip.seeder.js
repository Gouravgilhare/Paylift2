import pool from "../../config/db.config.js";

const seedTrips = async () => {
  const tripsData = [
    {
      userId: 1,
      riderId: 1,
      vehicleId: 1,
      vehicle_category: "bike",
      status: "completed",
      start_lat: 12.9715987,
      start_lng: 77.5945627,
      end_lat: 12.9758302,
      end_lng: 77.6015546,
      distance_km: 5.2,
      duration_minutes: 15,
      base_fare: 20.0,
      price_per_km: 10.0,
      price_per_min: 0.5,
      total_fare: 85.5,
      payment_method: "cash",
      payment_status: "paid",
    },
    {
      userId: 2,
      riderId: 1,
      vehicleId: 2,
      vehicle_category: "auto",
      status: "completed",
      start_lat: 12.9716987,
      start_lng: 77.5946627,
      end_lat: 12.9859302,
      end_lng: 77.6116546,
      distance_km: 8.5,
      duration_minutes: 25,
      base_fare: 30.0,
      price_per_km: 12.0,
      price_per_min: 1.0,
      total_fare: 157.0,
      payment_method: "online",
      payment_status: "paid",
    },
    {
      userId: 3,
      riderId: 2,
      vehicleId: 3,
      vehicle_category: "mini",
      status: "completed",
      start_lat: 12.971798,
      start_lng: 77.594663,
      end_lat: 12.96593,
      end_lng: 77.589154,
      distance_km: 6.8,
      duration_minutes: 20,
      base_fare: 50.0,
      price_per_km: 15.0,
      price_per_min: 2.0,
      total_fare: 152.0,
      payment_method: "cash",
      payment_status: "paid",
    },
    {
      userId: 4,
      riderId: 3,
      vehicleId: 4,
      vehicle_category: "prime",
      status: "completed",
      start_lat: 12.972198,
      start_lng: 77.595063,
      end_lat: 13.015938,
      end_lng: 77.609154,
      distance_km: 12.3,
      duration_minutes: 35,
      base_fare: 100.0,
      price_per_km: 20.0,
      price_per_min: 3.0,
      total_fare: 426.0,
      payment_method: "online",
      payment_status: "paid",
    },
    {
      userId: 1,
      riderId: 1,
      vehicleId: 1,
      vehicle_category: "bike",
      status: "requested",
      start_lat: 12.9725987,
      start_lng: 77.5955627,
      end_lat: null,
      end_lng: null,
      distance_km: 0,
      duration_minutes: 0,
      base_fare: 20.0,
      price_per_km: 10.0,
      price_per_min: 0.5,
      total_fare: 0,
      payment_method: "cash",
      payment_status: "pending",
    },
  ];

  try {
    for (const trip of tripsData) {
      const query =
        "INSERT INTO trips (userId, riderId, vehicleId, vehicle_category, status, start_lat, start_lng, end_lat, end_lng, distance_km, duration_minutes, base_fare, price_per_km, price_per_min, total_fare, payment_method, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [
        trip.userId,
        trip.riderId,
        trip.vehicleId,
        trip.vehicle_category,
        trip.status,
        trip.start_lat,
        trip.start_lng,
        trip.end_lat,
        trip.end_lng,
        trip.distance_km,
        trip.duration_minutes,
        trip.base_fare,
        trip.price_per_km,
        trip.price_per_min,
        trip.total_fare,
        trip.payment_method,
        trip.payment_status,
      ];
      await pool.promise().query(query, values);
    }
    console.log("   ✓ Trips seeded");
  } catch (error) {
    console.error("   ✗ Error seeding trips:", error.message);
    throw error;
  }
};

export default seedTrips;
