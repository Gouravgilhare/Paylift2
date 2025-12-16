import db from "../../config/db.config.js";

const seedVehiclePricing = async () => {
  const pricingData = [
    {
      category: "bike",
      base_fare: 20.0,
      per_km: 10.0,
      per_minute: 0.5,
      min_fare: 30.0,
      cancellation_fee: 20.0,
    },
    {
      category: "auto",
      base_fare: 30.0,
      per_km: 12.0,
      per_minute: 1.0,
      min_fare: 40.0,
      cancellation_fee: 30.0,
    },
    {
      category: "mini",
      base_fare: 50.0,
      per_km: 15.0,
      per_minute: 2.0,
      min_fare: 60.0,
      cancellation_fee: 50.0,
    },
    {
      category: "prime",
      base_fare: 100.0,
      per_km: 20.0,
      per_minute: 3.0,
      min_fare: 120.0,
      cancellation_fee: 100.0,
    },
    {
      category: "suv",
      base_fare: 150.0,
      per_km: 25.0,
      per_minute: 4.0,
      min_fare: 180.0,
      cancellation_fee: 150.0,
    },
  ];

  try {
    for (const pricing of pricingData) {
      const query =
        "INSERT INTO vehicle_pricing (category, base_fare, per_km, per_minute, min_fare, cancellation_fee) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        pricing.category,
        pricing.base_fare,
        pricing.per_km,
        pricing.per_minute,
        pricing.min_fare,
        pricing.cancellation_fee,
      ];
      await db.promise().query(query, values);
    }
    console.log("   ✓ Vehicle pricing seeded");
  } catch (error) {
    console.error("   ✗ Error seeding vehicle pricing:", error.message);
    throw error;
  }
};

export default seedVehiclePricing;
