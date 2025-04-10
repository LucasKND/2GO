document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ff3a3a",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Tech Metrics Particles Configuration - Red & Black Theme
    particlesJS("metrics-canvas", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#ff0000", "#a50000", "#ff3333", "#c70000"]
            },
            "shape": {
                "type": ["circle", "triangle", "polygon"],
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 6
                }
            },
            "opacity": {
                "value": 0.3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ff0000",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 1.5,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "bounce",
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.8
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 4,
                    "duration": 2,
                    "opacity": 0.8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Data trail animation
    function animateDataTrails() {
        const metrics = document.querySelectorAll('.metric');
        if (metrics.length < 2) return;
        
        // Get positions for animation
        const trailSVG = document.querySelector('.data-trail svg');
        const trail12 = document.querySelector('.trail-path.trail-1-2');
        const trail23 = document.querySelector('.trail-path.trail-2-3');
        
        // Calculate positions based on metrics elements
        const getMetricCenter = (index) => {
            const rect = metrics[index].getBoundingClientRect();
            const containerRect = document.querySelector('.metrics-container').getBoundingClientRect();
            return {
                x: (rect.left + rect.width/2) - containerRect.left,
                y: (rect.top + rect.height/2) - containerRect.top
            };
        };
        
        // Set trail paths
        if (metrics.length >= 2) {
            const p1 = getMetricCenter(0);
            const p2 = getMetricCenter(1);
            trail12.setAttribute('d', `M${p1.x},${p1.y} C${(p1.x+p2.x)/2},${p1.y} ${(p1.x+p2.x)/2},${p2.y} ${p2.x},${p2.y}`);
        }
        
        if (metrics.length >= 3) {
            const p2 = getMetricCenter(1);
            const p3 = getMetricCenter(2);
            trail23.setAttribute('d', `M${p2.x},${p2.y} C${(p2.x+p3.x)/2},${p2.y} ${(p2.x+p3.x)/2},${p3.y} ${p3.x},${p3.y}`);
        }
    }
    
    // Run on load and resize
    window.addEventListener('resize', animateDataTrails);
    setTimeout(animateDataTrails, 1000); // Delay to ensure elements are positioned
});
