var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS with very permissive settings for development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow any origin
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register calculator service
builder.Services.AddScoped<ServiceC.Business.Interfaces.ICalculatorService, ServiceC.Business.Services.CalculatorService>();

// Configure port
builder.WebHost.UseUrls("http://0.0.0.0:5003", "https://0.0.0.0:5003");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS before routing and endpoints
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Log startup
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Service C starting up at {time}", DateTimeOffset.Now);
logger.LogInformation("CORS and endpoints configured");

app.Run();