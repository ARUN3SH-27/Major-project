import matplotlib.pyplot as plt
import numpy as np

# Categories for comparison
categories = [
    "API Call Efficiency", "Performance", "Data Persistence",
    "Error Handling", "Model Input Consistency", "Scalability"
]

# Assigning scores (lower is worse, higher is better)
without_mongodb = [2, 2, 1, 2, 2, 2]  # First code (without MongoDB)
with_mongodb = [5, 5, 5, 5, 5, 5]  # Second code (with MongoDB)

# Set the bar width
bar_width = 0.35
index = np.arange(len(categories))

# Create the bar chart
fig, ax = plt.subplots(figsize=(10, 6))
bars1 = ax.bar(index - bar_width/2, without_mongodb, bar_width, label="Without MongoDB", color='red', alpha=0.7)
bars2 = ax.bar(index + bar_width/2, with_mongodb, bar_width, label="With MongoDB", color='green', alpha=0.7)

# Formatting the chart
ax.set_xlabel("Aspects")
ax.set_ylabel("Efficiency Score (Higher is Better)")
ax.set_title("Impact of MongoDB Caching on Model Performance")
ax.set_xticks(index)
ax.set_xticklabels(categories, rotation=30, ha="right")
ax.legend()

# Display the chart
plt.tight_layout()
plt.show()
