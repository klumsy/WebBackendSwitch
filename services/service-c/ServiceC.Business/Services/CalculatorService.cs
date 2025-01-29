using ServiceC.Business.Interfaces;
using ServiceC.Business.Models;

namespace ServiceC.Business.Services;

public class CalculatorService : ICalculatorService
{
    private readonly Random _random = new Random();

    public CalculationResult Add(int number1, int number2)
    {
        return new CalculationResult
        {
            Number1 = number1,
            Number2 = number2,
            Sum = number1 + number2,
            RandomNumber = _random.Next(1, 1000),
            Timestamp = DateTime.UtcNow
        };
    }
}
