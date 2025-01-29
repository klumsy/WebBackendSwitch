using ServiceC.Business.Interfaces;
using ServiceC.Business.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add Business Logic services
builder.Services.AddScoped<ICalculatorService, CalculatorService>();

var app = builder.Build();

app.UseCors();
app.MapControllers();

app.Run("http://0.0.0.0:5003");
