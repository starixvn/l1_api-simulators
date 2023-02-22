using Asp.Versioning;
using Asp.Versioning.Conventions;
using MemberLoginApiSimulator.Extensions;
using MemberLoginApiSimulator.Handlers;
using MemberLoginApiSimulator.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRestServices(builder.Configuration);
builder.Services.AddScoped<IOWHandler, OWHandler>();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});

var app = builder.Build();
var version1Set = app.NewApiVersionSet()
    .HasApiVersion(1.0)
    .HasApiVersion(1.2)
    .ReportApiVersions()
    .Build();

app.MapPost("/v{version:apiVersion}/auth/login", async ([FromBody] MemberLogin model, [FromServices] IOWHandler handler) =>
{
    var result = await handler.HandleMemberLogin(model);
    return Results.Ok(result);
}).WithApiVersionSet(version1Set);

app.Run($"http://0.0.0.0:{builder.Configuration["HostingPort"]}");