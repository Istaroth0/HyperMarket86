// Calculator functions
function calculateAll() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const customerDown = parseFloat(document.getElementById('customer-down-payment').value) || 0;
    const sellerDown = parseFloat(document.getElementById('seller-down-payment').value) || 0;

    const adjustedAmount = loanAmount - (customerDown - sellerDown);

    const terms = [
        { months: 48, rate: 1.5973, elementId: 'result-48' },
        { months: 36, rate: 1.4447, elementId: 'result-36' },
        { months: 24, rate: 1.333, elementId: 'result-24' }
    ];

    terms.forEach(term => {
        const totalPayment = adjustedAmount * term.rate;
        const monthlyPayment = totalPayment / term.months;

        const formatted = monthlyPayment.toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        });

        document.getElementById(term.elementId).textContent = formatted;
    });
}

function copyResult(id) {
    const element = document.getElementById(id);
    if (!element) return;

    const value = element.textContent;
    navigator.clipboard.writeText(value).then(() => {
        alert(`Copied: ${value}`);
    });
}

// Make functions available globally
window.calculateAll = calculateAll;
window.copyResult = copyResult;

// Initialize input validation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['loan-amount', 'customer-down-payment', 'seller-down-payment'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
            });
        }
    });
});

