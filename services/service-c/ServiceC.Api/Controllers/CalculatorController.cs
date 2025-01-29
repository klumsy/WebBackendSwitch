using Microsoft.AspNetCore.Mvc;
using ServiceC.Business.Interfaces;
using ServiceC.Business.Models;

namespace ServiceC.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalculatorController : ControllerBase
{
    private readonly ICalculatorService _calculatorService;

    public CalculatorController(ICalculatorService calculatorService)
    {
        _calculatorService = calculatorService;
    }

    [HttpGet("add/{number1}/{number2}")]
    public ActionResult<CalculationResult> Add(int number1, int number2)
    {
        return Ok(_calculatorService.Add(number1, number2));
    }
}
