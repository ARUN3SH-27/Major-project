// Visualization Module for Twitter Account Analysis Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all visualizations after the DOM is loaded
    initEngagementChart();
    initNetworkVisualization();
    initContentTypeChart();
    initActivityTimeChart();
    setupTooltips();
    setupThemeToggle();
});

// Engagement Over Time Chart (Chart.js)
function initEngagementChart() {
    const ctx = document.getElementById('timeSeriesChart').getContext('2d');
    
    // Sample data - in a real app this would come from the backend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const engagementData = {
        labels: months,
        datasets: [
            {
                label: 'Likes Received',
                data: [120, 190, 170, 220, 300, 280, 350, 400, 380, 450, 500, 600],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            },
            {
                label: 'Retweets',
                data: [50, 70, 60, 90, 120, 100, 130, 150, 140, 160, 180, 200],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: engagementData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 10,
                    usePointStyle: true
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0',
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
}

// Network Visualization (Force-directed graph using D3.js)
function initNetworkVisualization() {
    const container = document.querySelector('.network-graph');
    if (!container) return;

    const width = container.clientWidth;
    const height = 400;
    
    // Create SVG element
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Sample data - in a real app this would come from the backend
    const nodes = [
        { id: 'center', group: 0, size: 20 },
        { id: 'node1', group: 1, size: 10 },
        { id: 'node2', group: 1, size: 10 },
        { id: 'node3', group: 2, size: 10 },
        { id: 'node4', group: 2, size: 10 },
        { id: 'node5', group: 3, size: 10 }
    ];
    
    const links = [
        { source: 'center', target: 'node1' },
        { source: 'center', target: 'node2' },
        { source: 'center', target: 'node3' },
        { source: 'center', target: 'node4' },
        { source: 'center', target: 'node5' },
        { source: 'node1', target: 'node2' },
        { source: 'node3', target: 'node4' }
    ];
    
    // Color scale for groups
    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3])
        .range(['#4fc3f7', '#ff4d4d', '#4caf50', '#ff9800']);
    
    // Simulation setup
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.size + 5));
    
    // Draw links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#666')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.6);
    
    // Draw nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => d.size)
        .attr('fill', d => color(d.group))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add labels
    const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('dy', -15)
        .attr('text-anchor', 'middle')
        .text(d => d.id === 'center' ? '@user' : '')
        .style('fill', '#e0e0e0')
        .style('font-size', '12px');
    
    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });
    
    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newWidth = container.clientWidth;
        svg.attr('width', newWidth);
        simulation.force('center', d3.forceCenter(newWidth / 2, height / 2)).restart();
    });
}

// Content Type Chart (Chart.js)
function initContentTypeChart() {
    const ctx = document.getElementById('contentTypeChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Original', 'Retweets', 'Replies', 'Media'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#e0e0e0',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 10
                }
            },
            cutout: '70%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Activity Time Chart (Chart.js)
function initActivityTimeChart() {
    const ctx = document.getElementById('activityTimeChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
            datasets: [{
                label: 'Posts',
                data: [5, 2, 8, 15, 25, 30, 22, 18],
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 30, 0.95)',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 10
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
}

// Setup tooltips for indicator cards
function setupTooltips() {
    document.querySelectorAll('.indicator-card').forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.querySelector('h3').textContent;
            const value = this.querySelector('h3 span').textContent;
            const riskLevel = this.classList.contains('high-risk') ? 'High Risk' : 
                            this.classList.contains('moderate-risk') ? 'Moderate Risk' : 'Low Risk';
            
            // Create a modal
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '1000';
            
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = '#1e1e1e';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '10px';
            modalContent.style.maxWidth = '500px';
            modalContent.style.width = '90%';
            modalContent.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            
            modalContent.innerHTML = `
                <h3 style="margin-top: 0; color: #e0e0e0; font-size: 1.4rem;">${feature} Analysis</h3>
                <div style="display: flex; align-items: center; margin: 15px 0;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${
                        riskLevel === 'High Risk' ? '#ff4d4d' : 
                        riskLevel === 'Moderate Risk' ? '#ff9800' : '#4caf50'
                    }; margin-right: 10px;"></div>
                    <span style="color: #e0e0e0;">${riskLevel} (${value})</span>
                </div>
                <p style="color: #b0b0b0; line-height: 1.6;">
                    ${this.querySelector('.indicator-desc').textContent}
                </p>
                <p style="color: #e0e0e0; margin-top: 20px;">
                    <strong>Why this matters:</strong><br>
                    ${getFeatureExplanation(feature)}
                </p>
                <button style="margin-top: 25px; padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer; float: right;">
                    Close
                </button>
            `;
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            modal.querySelector('button').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
        });
    });
    
    function getFeatureExplanation(feature) {
        const explanations = {
            'Followers/Friends Ratio': 'Authentic accounts typically have a balanced ratio where they follow a similar number of accounts as follow them. Extremely high ratios may indicate purchased followers or follow-back schemes, while very low ratios might suggest mass-following behavior.',
            'Tweets per Day': 'Normal human users typically post between 5-20 tweets per day. Automated accounts or spam accounts often post at much higher frequencies, sometimes hundreds per day.',
            'Account Age': 'New accounts (less than 30 days old) are more likely to be disposable or created for short-term purposes. Established accounts with long histories are generally more trustworthy.',
            'Description Length': 'Genuine accounts usually have detailed profile descriptions with personal information. Fake accounts often have minimal, generic, or no descriptions at all.',
            'Likes Ratio': 'Real users engage with content by liking posts at a relatively consistent rate. Bots often either like nothing or like everything indiscriminately.',
            'Default Profile': 'Accounts using default profile pictures and settings are more likely to be fake or inactive. Real users typically customize their profiles.',
            'Posting Consistency': 'Human users have natural variations in their posting patterns. Accounts with perfectly consistent or highly irregular posting times may be automated.',
            'Link Ratio': 'Authentic accounts share a mix of original content and links. Accounts that primarily post links, especially to the same domains, may be spam accounts.'
        };
        
        return explanations[feature] || 'This metric helps assess the authenticity of the account based on common patterns observed in genuine versus fake accounts.';
    }
}

// Theme toggle functionality
function setupThemeToggle() {
    const toggleBtn = document.getElementById('toggle-theme');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        // Update charts if needed
        const charts = Chart.instances;
        for (let i = 0; i < charts.length; i++) {
            charts[i].update();
        }
    });
}

// Export functions if needed by other modules
window.dashboardVisualizations = {
    initEngagementChart,
    initNetworkVisualization,
    initContentTypeChart,
    initActivityTimeChart
};