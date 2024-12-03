<template>
  <div class="statistics">
    <div class="header">
      <h1>Thống Kê</h1>
      <button class="refresh-button" @click="fetchData">Cập Nhật</button>
    </div>
    <div class="chart-grid">
      <div class="chart-container">
        <h3>Doanh Thu</h3>
        <canvas id="revenueChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Sản Phẩm Hàng Đầu</h3>
        <canvas id="topProductsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  setup() {
    const revenueData = ref([]);
    const topProductsData = ref([]);

    const fetchData = async () => {
      try {
        const response = await axios.get("/db.json"); // Giả sử db.json nằm trong thư mục public
        const data = response.data;

        // Cập nhật doanh thu
        revenueData.value = data.orders.map((order) => order.total);

        // Cập nhật sản phẩm bán chạy
        const productCounts = {};
        data.orders.forEach((order) => {
          order.products.forEach((product) => {
            const productId = product.productId;
            if (!productCounts[productId]) {
              productCounts[productId] = 0;
            }
            productCounts[productId] += product.quantity;
          });
        });
        topProductsData.value = Object.entries(productCounts)
          .map(([productId, count]) => ({
            productId,
            count,
          }))
          .sort((a, b) => b.count - a.count) // Sắp xếp theo số lượng
          .slice(0, 4); // Lấy 4 sản phẩm bán chạy nhất

        // Cập nhật biểu đồ sau khi dữ liệu đã được lấy
        updateCharts();
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    const updateCharts = () => {
      const revenueCtx = document
        .getElementById("revenueChart")
        .getContext("2d");
      new Chart(revenueCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Có thể thay đổi để hiển thị theo tháng thực tế
          datasets: [
            {
              label: "Doanh Thu",
              data: revenueData.value, // Dữ liệu từ db.json
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              fill: true,
            },
          ],
        },
      });

      const topProductsCtx = document
        .getElementById("topProductsChart")
        .getContext("2d");
      new Chart(topProductsCtx, {
        type: "pie",
        data: {
          labels: topProductsData.value.map(
            (item) => `Sản phẩm ${item.productId}`
          ),
          datasets: [
            {
              data: topProductsData.value.map((item) => item.count),
              backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            },
          ],
        },
      });
    };

    // Lấy dữ liệu khi component được mount
    onMounted(fetchData);

    return {
      fetchData,
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Button */
.refresh-button {
  background: linear-gradient(90deg, #57ca85, #45b568);
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.refresh-button:hover {
  transform: scale(1.05);
}

/* Chart Grid */
.chart-grid {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

/* Chart Container */
.chart-container {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.chart-container h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
}
</style>
