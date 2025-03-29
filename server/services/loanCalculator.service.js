class LoanCalculationService {
    calculateLoanPayments(amount, months, interestRate, penaltyRate) {
      const interest = (amount * (interestRate / 100));
      const totalAmount = parseFloat(amount) + interest;
      const monthlyPayment = totalAmount / months;
  
      return {
        total_amount: totalAmount,
        monthly_payment: monthlyPayment,
        total_interest: interest,
        penalty_amount: monthlyPayment * (penaltyRate / 100)
      };
    }
  
    calculateRemainingBalance(loanAmount, totalPaid) {
      return Math.max(0, loanAmount - totalPaid);
    }
  
    calculatePenalty(monthlyPayment, penaltyRate, daysLate) {
      const dailyPenaltyRate = penaltyRate / 30; // Assuming 30 days per month
      return monthlyPayment * (dailyPenaltyRate / 100) * daysLate;
    }
  
    calculateNextPaymentDate(startDate, lastPaymentDate, monthlyInterval) {
      const start = new Date(startDate);
      const last = lastPaymentDate ? new Date(lastPaymentDate) : start;
      
      let nextDate = new Date(last);
      nextDate.setMonth(nextDate.getMonth() + monthlyInterval);
      
      return nextDate;
    }
  
    generatePaymentSchedule(amount, months, interestRate, startDate) {
      const { monthly_payment } = this.calculateLoanPayments(amount, months, interestRate, 0);
      const schedule = [];
      let remainingBalance = parseFloat(amount);
      let currentDate = new Date(startDate);
  
      for (let i = 1; i <= months; i++) {
        const payment = {
          payment_number: i,
          due_date: new Date(currentDate),
          monthly_amount: monthly_payment,
          principal: monthly_payment * (1 - (interestRate / 100) / 12),
          interest: monthly_payment * ((interestRate / 100) / 12),
          balance: remainingBalance
        };
  
        schedule.push(payment);
        remainingBalance -= payment.principal;
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
  
      return schedule;
    }
  }
  
  module.exports = new LoanCalculationService();
