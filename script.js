// Handle user type button clicks
document.querySelectorAll('.user-type-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        document.querySelectorAll('.user-type-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Store selected user type in hidden input
        const userTypeInput = document.getElementById('userType');
        if (userTypeInput) {
            userTypeInput.value = this.dataset.type;
        }
    });
});

document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userTypeInput = document.getElementById('userType');
    const userType = userTypeInput ? userTypeInput.value : null;
    
    if (!userType) {
        alert('Please select your user type (Business or Individual)');
        return;
    }
    
    const email = document.getElementById('email').value;
    const button = this.querySelector('button[type="submit"]');
    const originalButtonText = button.textContent;
    
    // Show loading state
    button.textContent = 'Joining...';
    button.disabled = true;
    
    // Create labeled email based on user type
    const labeledEmail = `${userType.toUpperCase()}: ${email}`;
    
    // Send data to webhook
    fetch('https://hooks.zapier.com/hooks/catch/22345319/2c036mk/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: labeledEmail,
            userType: userType
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Success state
        button.textContent = '✓ Joined!';
        button.style.background = 'linear-gradient(135deg, #00c853, #64dd17)';
        
        // Reset form
        document.getElementById('email').value = '';
        document.querySelectorAll('.user-type-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        if (userTypeInput) {
            userTypeInput.value = '';
        }
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalButtonText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        button.textContent = 'Error, try again';
        button.style.background = 'linear-gradient(135deg, #ff5252, #ff1744)';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalButtonText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    });
});