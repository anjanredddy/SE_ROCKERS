const calculateLoanAmortization = (principal, months, interestRate) => {
    const monthlyRate = (interestRate / 100) / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    let balance = principal;
    const schedule = [];
  
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      balance -= principalPaid;
  
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      });
    }
  
    return {
      monthlyPayment,
      totalPayment: monthlyPayment * months,
      totalInterest: (monthlyPayment * months) - principal,
      schedule
    };
  };
  
  export { calculateLoanAmortization };
