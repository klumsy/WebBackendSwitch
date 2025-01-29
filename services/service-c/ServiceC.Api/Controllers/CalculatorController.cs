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
    public ActionResult<CalculationResult> Add([FromRoute] int number1, [FromRoute] int number2)
    {
        try
        {
            var result = _calculatorService.Add(number1, number2);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}