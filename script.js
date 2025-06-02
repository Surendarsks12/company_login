// Replace with your deployed Web App URL
const webAppUrl = 'https://script.google.com/macros/s/AKfycbz8QHb8pXwlBXc08KCx9ddo45RFTVfquNdeJCqJUGbEWl6hRgWqHev9YI1Psvsb9qXe9Q/exec';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const dataEntryForm = document.getElementById('dataEntryForm');

  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const companyName = document.getElementById('companyName').value;
      const phoneNumber = document.getElementById('phoneNumber').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      google.script.run.withSuccessHandler(message => {
        document.getElementById('message').innerText = message;
      }).registerCompany(companyName, phoneNumber, email, password);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      google.script.run.withSuccessHandler(response => {
        if (response.success) {
          sessionStorage.setItem('role', response.role);
          sessionStorage.setItem('companyName', response.companyName);
          sessionStorage.setItem('email', email);
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('loginMessage').innerText = 'Invalid credentials.';
        }
      }).login(email, password);
    });
  }

  if (dataEntryForm) {
    const role = sessionStorage.getItem('role');
    const companyName = sessionStorage.getItem('companyName');
    const email = sessionStorage.getItem('email');

    if (role === 'Management') {
      document.getElementById('managementSection').style.display = 'block';
      google.script.run.withSuccessHandler(link => {
        document.getElementById('spreadsheetLink').href = link;
      }).getSpreadsheetLink(companyName);
    } else if (role === 'Employee') {
      document.getElementById('employeeSection').style.display = 'block';
      dataEntryForm.addEventListener('submit', e => {
        e.preventDefault();
        const dataEntry = document.getElementById('dataEntry').value;

        google.script.run.withSuccessHandler(message => {
          document.getElementById('dataMessage').innerText = message;
          document.getElementById('dataEntry').value = '';
        }).submitData(companyName, email, dataEntry);
      });
    }
  }
});
