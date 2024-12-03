<template>
  <div class="dashboard-box">
    <div class="header">
      <h1>Quản Lý</h1>
      <p>Tổng quan về hiệu suất hôm nay.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <h3>{{ stat.title }}</h3>
        <p class="value">{{ stat.value }}</p>
        <p class="updated">{{ stat.updated }}</p>
      </div>
    </div>
    <div class="chart-section">
      <canvas id="salesChart" class="responsive"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import axios from "axios"; // Import axios
import Chart from "chart.js/auto";

export default {
  setup() {
    // Dữ liệu thống kê
    const stats = reactive([
      { title: "Doanh Thu", value: "$0", updated: "Cập nhật ngay" },
      { title: "Đơn Hàng", value: "0", updated: "Cập nhật ngay" },
      { title: "Khách Hàng Mới", value: "0", updated: "Cập nhật ngay" },
      { title: "Lượt Ghé Thăm", value: "0", updated: "Cập nhật ngay" },
    ]);

    // Lấy dữ liệu từ db.json
    const fetchData = async () => {
      try {
        const response = await axios.get("/db.json"); // Đường dẫn đến tệp db.json
        const data = response.data;

        // Tính toán và cập nhật số liệu thống kê
        const totalRevenue = data.orders.reduce(
          (acc, order) => acc + order.total,
          0
        );
        const totalOrders = data.orders.length;
        const activeCustomers = data.customers.filter(
          (customer) => customer.status !== "Vô hiệu hóa"
        ).length;
        const totalVisits = data.customers.length; // Bạn có thể tính lượt ghé thăm khác nếu cần

        stats[0].value = `$${totalRevenue}`; // Cập nhật Doanh Thu
        stats[1].value = `${totalOrders}`; // Cập nhật Đơn Hàng
        stats[2].value = `${activeCustomers}`; // Cập nhật Khách Hàng Mới
        stats[3].value = `${totalVisits}`; // Cập nhật Lượt Ghé Thăm
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    // Biểu đồ doanh thu
    onMounted(() => {
      fetchData(); // Lấy dữ liệu khi component được gắn vào DOM
      const ctx = document.getElementById("salesChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
          ],
          datasets: [
            {
              label: "Doanh Thu ($)",
              data: [10000, 12000, 15000, 14000, 18000, 20000], // Dữ liệu doanh thu mẫu, bạn có thể lấy từ db.json
              borderColor: "#ff758c",
              backgroundColor: "rgba(255, 117, 140, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    });

    return { stats };
  },
};
</script>

<style scoped>
/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.header p {
  font-size: 1rem;
  color: #666;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: bold;
  color: #0072ff;
}

.stat-card .updated {
  font-size: 0.9rem;
  color: #888;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 400px; /* Chiều cao biểu đồ */
}

.responsive {
  width: 100%;
  height: 100%;
}
</style>
