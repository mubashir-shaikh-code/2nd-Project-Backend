const db = require("../db"); // ✅ MySQL connection

// ✅ Place a new order
const placeOrder = async (req, res) => {
  try {
    console.log("📦 Incoming Order Data:", req.body); // ✅ Debug log

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    const userId = req.user.id;
    let totalPrice = 0; // ✅ Track total order cost

    // ✅ Insert each item into DB
    for (let item of items) {
      if (!item.productId || !item.price) {
        console.error("❌ Missing productId or price in item:", item);
        return res.status(400).json({
          error: "Each item must include productId and price",
          item,
        });
      }

      const finalPrice = parseFloat(item.price) * (item.quantity || 1);
      totalPrice += finalPrice; // ✅ Add to total

      await db.query(
        `INSERT INTO orders 
          (userId, productId, price, status, cancelRequest, cancelApproved) 
         VALUES (?, ?, ?, 'Pending', false, false)`,
        [userId, item.productId, finalPrice]
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      totalPrice,
    });
  } catch (err) {
    console.error("❌ Order placement failed:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// ✅ Get orders for logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT 
          o.id,
          o.productId,
          o.price AS orderPrice,
          o.status,
          (o.cancelRequest = 1) AS cancelRequest,   -- ✅ returns true/false
          (o.cancelApproved = 1) AS cancelApproved,          -- ✅ returns true/false
          p.description,   -- 👈 product description = product name
          p.price AS productPrice,
          p.image,
          p.category
       FROM orders o
       JOIN products p ON o.productId = p.id
       WHERE o.userId = ?`,
      [userId]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch user orders:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// ✅ Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT 
          o.id,
          o.userId,
          o.productId,
          o.price AS orderPrice,
          o.status,
          (o.cancelRequest = 1) AS cancelRequest,   -- ✅ returns true/false
          (o.cancelApproved = 1) AS cancelApproved,          -- ✅ returns true/false
          u.username,
          u.email,
          p.description,   -- 👈 product description = product name
          p.price AS productPrice,
          p.image,
          p.category
       FROM orders o
       JOIN users u ON o.userId = u.id
       JOIN products p ON o.productId = p.id`
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

// ✅ Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing status value" });
    }

    let cancelApproved = false;
    if (status === "Cancelled") cancelApproved = true;

    const [result] = await db.query(
      "UPDATE orders SET status=?, cancelApproved=? WHERE id=?",
      [status, cancelApproved, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// ✅ Request order cancellation (user)
const requestOrderCancellation = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const [rows] = await db.query("SELECT * FROM orders WHERE id=?", [orderId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    await db.query("UPDATE orders SET cancelRequest=true WHERE id=?", [orderId]);

    res.status(200).json({ message: "Cancellation request sent successfully" });
  } catch (error) {
    console.error("❌ Error requesting cancellation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Approve order cancellation (admin)
const approveOrderCancellation = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const [rows] = await db.query("SELECT * FROM orders WHERE id=?", [orderId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];

    if (!order.cancelRequest) {
      return res
        .status(400)
        .json({ message: "No cancellation request found for this order" });
    }

    await db.query(
      "UPDATE orders SET cancelApproved=true, status='Cancelled' WHERE id=?",
      [orderId]
    );

    res.status(200).json({ message: "Order cancellation approved" });
  } catch (error) {
    console.error("❌ Error approving cancellation:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestOrderCancellation,
  approveOrderCancellation,
};
