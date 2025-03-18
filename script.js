document.addEventListener("DOMContentLoaded", () => {
    const salesForm = document.getElementById("salesForm");
    const salesTableBody = document.querySelector("#salesTable tbody");

    // Function to fetch and display sales data
    const fetchSales = async () => {
        try {
            const response = await fetch("http://localhost:5000/sales");
            const data = await response.json();
            renderSales(data); // Render the sales data in the table
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    // Function to render sales data in the table
    const renderSales = (sales) => {
        salesTableBody.innerHTML = ""; // Clear existing rows

        // Loop through the sales data and create table rows
        sales.forEach((sale) => {
            const row = document.createElement("tr");

            // Add product and amount to the row
            row.innerHTML = `
                <td>${sale.product}</td>
                <td>${sale.amount}</td>
            `;

            // Append the row to the table body
            salesTableBody.appendChild(row);
        });
    };

    // Handle form submission
    salesForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const product = document.getElementById("product").value;
        const amount = document.getElementById("amount").value;

        try {
            const response = await fetch("http://localhost:5000/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ product, amount }),
            });

            if (response.ok) {
                alert("Sale recorded successfully!");
                salesForm.reset(); // Clear the form
                fetchSales(); // Refresh the sales list
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    });

    // Fetch sales data when the page loads
    fetchSales();
});