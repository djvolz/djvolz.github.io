// Modern Portfolio Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Simple Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial fade in for hero
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('visible');

    // Load Dynamic Strava Activities
    const activityContainer = document.getElementById('activity-list');
    if (activityContainer) {
        fetch('data/recent_activities.json')
            .then(response => {
                if (!response.ok) throw new Error('No data found');
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    activityContainer.innerHTML = '<p class="text-secondary" style="grid-column: 1/-1; text-align: center;">No recent activities found.</p>';
                    return;
                }

                activityContainer.innerHTML = ''; // Clear loading state
                
                data.forEach(act => {
                    const card = document.createElement('a');
                    card.href = act.link;
                    card.target = '_blank';
                    card.className = 'feature-card'; // Re-using feature card style for consistency
                    card.style.textAlign = 'left';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.justifyContent = 'space-between';
                    card.style.textDecoration = 'none';

                    card.innerHTML = `
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                <span class="feature-icon" style="font-size: 1.5rem; margin: 0;"><i class="fas ${act.icon}"></i></span>
                                <span style="font-size: 0.8rem; opacity: 0.6;">${act.date}</span>
                            </div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${act.name}</h3>
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--accent-primary);">
                            ${act.distance} mi
                        </div>
                    `;
                    activityContainer.appendChild(card);
                });
            })
            .catch(err => {
                console.log('Recent activity fetch failed (using fallback data):', err);
                // Fallback for local testing if file fetch fails
                const fallbackData = [
                    { name: "Tioga Road - Yosemite", date: "10/12/2024", type: "Ride", icon: "fa-bicycle", distance: "42.5", link: "https://www.strava.com/activities/11616277168" },
                    { name: "Lone Pine Peak", date: "09/15/2024", type: "RockClimbing", icon: "fa-mountain", distance: "12.0", link: "https://www.strava.com/activities/12244307447" },
                    { name: "Snoqualmie Pass", date: "08/20/2024", type: "Ride", icon: "fa-bicycle", distance: "35.2", link: "https://www.strava.com/activities/9800399551" }
                ];
                
                activityContainer.innerHTML = '';
                fallbackData.forEach(act => {
                    const card = document.createElement('a');
                    card.href = act.link;
                    card.target = '_blank';
                    card.className = 'feature-card';
                    card.style.textAlign = 'left';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.justifyContent = 'space-between';
                    card.style.textDecoration = 'none';

                    card.innerHTML = `
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                <span class="feature-icon" style="font-size: 1.5rem; margin: 0;"><i class="fas ${act.icon}"></i></span>
                                <span style="font-size: 0.8rem; opacity: 0.6;">${act.date}</span>
                            </div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${act.name}</h3>
                        </div>
                        <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--accent-primary);">
                            ${act.distance} mi
                        </div>
                    `;
                    activityContainer.appendChild(card);
                });
            });
    }
});
