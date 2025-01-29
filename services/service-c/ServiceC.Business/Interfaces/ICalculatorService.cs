using ServiceC.Business.Models;

namespace ServiceC.Business.Interfaces;

public interface ICalculatorService
{
    CalculationResult Add(int number1, int number2);
}