using Microsoft.AspNetCore.Mvc;
using ServiceC.Business.Interfaces;
using ServiceC.Business.Models;

namespace ServiceC.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CalculatorController : ControllerBase
{
    private readonly ICalculatorService _calculatorService;
    private readonly ILogger<CalculatorController> _logger;

    public CalculatorController(ICalculatorService calculatorService, ILogger<CalculatorController> logger)
    {
        _calculatorService = calculatorService;
        _logger = logger;
    }

    [HttpGet("add/{number1}/{number2}")]
    public ActionResult<CalculationResult> Add([FromRoute] int number1, [FromRoute] int number2)
    {
        try
        {
            _logger.LogInformation("Received calculation request for numbers: {Number1} and {Number2}", number1, number2);
            _logger.LogInformation("Request details - Method: {Method}, Path: {Path}, Scheme: {Scheme}", Request.Method, Request.Path, Request.Scheme);

            var result = _calculatorService.Add(number1, number2);
            _logger.LogInformation("Calculation successful. Result: {Result}", result.Sum);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during calculation");
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}