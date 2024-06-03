---
title: ASP.NET Core 使用教程
category_bar:
  - C#
tags:
  - C#
  - ASP.NET Core
  - Entity Framework Core
  - Swagger
  - FluentValidation
  - AutoMapper
  - Dependency injection
categories:
  - - 编程
    - C#
index_img: images/ASP.NET Core.png
abbrlink: d02acb8d
date: 2024-05-27 16:37:28
description:
---

## 一、应用启动

在 ASP.NET Core 应用程序中，启动过程由主机（Host）负责，它负责配置应用程序并启动运行时环境。以下是 ASP.NET Core 应用程序的启动过程及相关概念：

### 1. 主机（Host）

主机是 ASP.NET Core 应用程序的宿主环境，负责启动应用程序并提供运行时环境。主机可以是 Web 主机（如 IIS、Kestrel）、进程宿主（如 Console 应用）、自定义宿主等。

### 2. 应用程序启动

ASP.NET Core 应用程序的启动过程通常在 `Program.cs` 文件中进行配置和定义。以下是一个典型的 `Program.cs` 文件示例：

```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace MyApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
```

在 `Main` 方法中，通过调用 `CreateHostBuilder` 方法创建主机，并通过调用 `Build()` 方法构建主机，最后调用 `Run()` 方法启动应用程序。

### 3. 主机构建器（Host Builder）

`Host.CreateDefaultBuilder(args)` 方法创建了一个主机构建器，它会配置主机的默认行为。通常，主机构建器会加载配置、配置日志、设置主机环境等。

### 4. Web 主机配置

`ConfigureWebHostDefaults` 方法配置了 Web 主机的默认行为。在此处，可以配置 Web 主机的服务器（如 Kestrel）、应用程序配置、日志记录等。

### 5. 启动配置类（Startup Class）

`Startup` 类是 ASP.NET Core 应用程序的入口点，它包含了配置应用程序的逻辑。在 `ConfigureServices` 方法中，可以注册服务、配置中间件等；在 `Configure` 方法中，可以配置请求处理管道。

以下是一个典型的 `Startup.cs` 文件示例：

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MyApp
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // 添加其他服务配置
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
```

### 6. 启动过程总结

- 应用程序启动由主机负责，主机构建器配置默认行为。
- `ConfigureWebHostDefaults` 方法配置 Web 主机的默认行为，包括服务器、应用程序配置等。
- `Startup` 类是应用程序的入口点，负责配置应用程序的服务和请求处理管道。

通过以上启动过程，ASP.NET Core 应用程序能够在启动时正确配置和准备好运行时环境，并通过 `Startup` 类中的逻辑处理请求和提供服务。

## 二、依赖注入

依赖注入（Dependency Injection，简称 DI）是软件设计中的一种模式，通过将对象的依赖项（即其使用的其他对象）注入到该对象中，使得依赖关系更加明确和可控。ASP.NET Core 原生支持依赖注入，这使得服务的注册和管理变得简单和高效。

### 1. 依赖注入的核心概念

- **服务（Service）**：可以被应用程序中的其他部分使用的组件或对象。
- **容器（Container）**：用于管理服务的生命周期和解析服务依赖关系的对象。
- **注册（Registration）**：将服务类型和其实现类型添加到容器中。

### 2. 服务的生命周期

在 ASP.NET Core 中，服务可以有以下几种生命周期：

- **瞬态（Transient）**：每次请求服务时都会创建一个新的实例。适用于轻量级、无状态的服务。
- **作用域（Scoped）**：在一个请求的生命周期内创建一个实例。适用于需要在单个请求内保持状态的服务。
- **单例（Singleton）**：在应用程序的整个生命周期内只创建一个实例。适用于需要共享数据的服务。

### 3. 自定义扩展方法注册 Services

为了简化服务的注册过程，可以创建自定义扩展方法。通过自定义扩展方法，可以将服务的注册逻辑集中在一起，使 `Startup.cs` 文件更加简洁。

**示例：ServiceCollectionExtensions.cs**

```csharp
using Microsoft.Extensions.DependencyInjection;

namespace Loquy.Services.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddDependencyGroup(this IServiceCollection services)
        {
            services.AddScoped<IMyService, MyService>();
            return services;
        }
    }
}
```

在这个示例中，`AddDependencyGroup` 方法注册了一个作用域服务 `IMyService` 和其实现 `MyService`。

### 4. 在 Startup.cs 中注册服务

在 `Startup.cs` 文件的 `ConfigureServices` 方法中，调用我们定义的扩展方法来注册服务。

**示例：Startup.cs**

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // 注册 Services
    services.AddDependencyGroup();

    // 其他服务注册
}
```

通过这样的方法，我们可以将服务的注册逻辑分离到独立的扩展方法中，使得 `Startup.cs` 文件更加简洁。

## 三、中间件

在 ASP.NET Core 中，中间件是构建 Web 应用程序的核心组件之一，提供了灵活的机制来处理请求和生成响应。中间件允许您在请求到达终端处理程序之前或之后执行自定义操作，例如日志记录、身份验证、路由和错误处理等。

### 1. 自定义中间件

#### 1.1. 编写基于约定的中间件

ASP.NET Core 中间件的约定如下：

**公共构造函数**:
   - 中间件类应具有一个公共构造函数，该构造函数至少包含一个 `RequestDelegate` 类型的参数。

**Invoke 或 InvokeAsync 方法**:
   - 中间件类应包含一个名为 `Invoke` 或 `InvokeAsync` 的公共方法。
   - 该方法必须包含一个 `HttpContext` 类型的参数，并且必须返回一个 `Task`。

**依赖注入（DI）支持**:
   - 构造函数的其他参数可以通过依赖注入（DI）进行填充。
   - `Invoke` 或 `InvokeAsync` 方法的其他参数也可以通过 DI 进行填充，可以是 `Transient`、`Scoped` 或 `Singleton` 类型的参数。

下面是一个示例，展示了如何编写一个基于约定的中间件：

```csharp
public class CustomMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CustomMiddleware> _logger;

    // 构造函数，接收 RequestDelegate 和其他依赖项
    public CustomMiddleware(RequestDelegate next, ILogger<CustomMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    // InvokeAsync 方法
    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("Handling request: " + context.Request.Path);
        
        // 在处理请求之前执行的逻辑
        await _next(context);
        
        // 在处理完请求之后执行的逻辑
        _logger.LogInformation("Finished handling request.");
    }
}
```

注册和使用基于约定的中间件

在 `Program.cs` 中注册并使用这个中间件：

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseMiddleware<CustomMiddleware>();

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello, World!");
});

app.Run();
```

#### 1.2. 使用工厂模式的中间件

ASP.NET Core 还提供了一种使用工厂模式来激活中间件的方式，这种方式可以按请求创建中间件实例，提供更强的类型支持和灵活性。通过使用 `IMiddleware` 接口和中间件工厂，可以更好地控制中间件的生命周期和依赖项。


 创建实现 `IMiddleware` 接口的中间件:

```csharp
public class FactoryActivatedMiddleware : IMiddleware
{
    private readonly ILogger<FactoryActivatedMiddleware> _logger;

    public FactoryActivatedMiddleware(ILogger<FactoryActivatedMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        _logger.LogInformation("Handling request in factory activated middleware.");

        // 在处理请求之前执行的逻辑
        await next(context);

        // 在处理完请求之后执行的逻辑
        _logger.LogInformation("Finished handling request in factory activated middleware.");
    }
}
```

 注册中间件:

在 `Program.cs` 中注册这个中间件：

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加中间件到依赖注入容器
builder.Services.AddTransient<FactoryActivatedMiddleware>();

var app = builder.Build();

// 使用中间件
app.UseMiddleware<FactoryActivatedMiddleware>();

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello, World!");
});

app.Run();
```

通过这种方式，中间件实例可以在每个请求时创建和销毁，从而避免了单实例中间件可能带来的问题。

### 2. 分析中间件代码

中间件本质上是一个实现 `RequestDelegate` 委托的组件，接收一个 `HttpContext` 对象作为参数，并返回一个 `Task`。中间件的核心逻辑通过这个委托实现。您可以根据具体需求编写自定义中间件，以实现各种功能，如日志记录、异常处理等。

```csharp
public class CustomMiddleware
{
    private readonly RequestDelegate _next;

    public CustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 在处理请求之前执行的逻辑
        await _next(context);
        // 在处理完请求之后执行的逻辑
    }
}
```

### 3. 使用 WebApplication 创建中间件管道

您可以使用 `WebApplication` 类的 `Use` 方法来添加中间件到应用程序的请求处理管道中。中间件的顺序非常重要，它决定了它们在管道中的执行顺序。通常情况下，中间件按照它们添加到管道中的顺序依次执行。

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseMiddleware<CustomMiddleware>();

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello, World!");
});

app.Run();
```

### 4. 对请求管道进行短路

在 ASP.NET Core 中，当中间件决定不将请求传递给下一个中间件时，这被称为“让请求管道短路”。短路通常是必要的，因为它可以避免不必要的工作，从而提高性能。例如，静态文件中间件可以处理对静态文件的请求，并终止管道的进一步处理，成为终端中间件。

#### 1. 为什么需要短路

1. **性能优化**：避免不必要的中间件执行。例如，静态文件中间件可以直接返回文件内容，而不需要其他中间件处理。
2. **简化逻辑**：确保特定条件下的请求得到适当处理，而无需经过所有中间件。
3. **安全性**：确保在某些情况下请求不会到达不应该处理它们的中间件。

#### 2. 示例：静态文件中间件

以下示例展示了静态文件中间件如何短路请求管道：

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseStaticFiles(); // 静态文件中间件

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello, World!");
});

app.Run();
```

在这个示例中，如果请求匹配一个静态文件（例如 CSS 或图像），`UseStaticFiles` 中间件会处理请求并短路管道，不会调用后续的中间件。

#### 3. 确保短路后正确处理

如果中间件决定短路请求，它应该确保响应已正确生成并发送到客户端。调用 `next.Invoke` 之后进行响应处理时要特别小心，因为在响应已经启动后，修改响应头或状态码会引发异常。

#### 4. 示例：条件短路

以下示例展示了如何在自定义中间件中实现条件短路：

```csharp
public class CustomMiddleware
{
    private readonly RequestDelegate _next;

    public CustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (ShouldShortCircuit(context))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Forbidden");
            return; // 短路请求管道
        }

        await _next(context); // 调用下一个中间件

        // 注意：在调用 next 之后，避免修改响应头或状态码
    }

    private bool ShouldShortCircuit(HttpContext context)
    {
        // 这里可以加入实际的短路条件，例如身份验证或其他检查
        return !context.User.Identity.IsAuthenticated;
    }
}
```

#### 51. 警告：避免在响应启动后调用 `next.Invoke`

在向客户端发送响应期间和之后，请勿调用 `next.Invoke`。响应一旦启动，更改响应头或状态码将引发异常。以下是一些可能的结果：

1. **协议冲突**：例如，写入超过 `Content-Length` 指定的字节数。
2. **损坏正文格式**：例如，将 HTML 页脚写入 CSS 文件中。

#### 6. 检查响应是否已启动

`HttpContext.Response.HasStarted` 是一个有用的属性，它指示是否已经发送了响应头或写入了响应正文。可以在调用 `next.Invoke` 之前检查这个属性，确保在适当的时机执行必要的操作。

#### 7. 示例：检查 `HasStarted`

```csharp
public class CustomMiddleware
{
    private readonly RequestDelegate _next;

    public CustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 执行一些逻辑，例如身份验证
        await _next(context);

        if (!context.Response.HasStarted)
        {
            // 在响应尚未开始时，安全地修改响应头或状态码
            context.Response.Headers.Add("X-Custom-Header", "Value");
        }
        else
        {
            // 日志记录或其他操作
            Console.WriteLine("响应已经启动，无法修改响应头");
        }
    }
}
```

### 5. 使用 Run 委托

`Run` 方法是 `WebApplication` 类中用于添加终端处理程序的方法。它接收一个 `RequestDelegate` 委托作为参数，表示处理请求的最终逻辑。您可以在这里编写应用程序的核心逻辑，例如返回页面或数据。

```csharp
app.Run(async context =>
{
    await context.Response.WriteAsync("Hello, World!");
});
```

### 6. 灵活的中间件调用

ASP.NET Core 中的 `Use` 方法有多个重载版本，其中一个重载版本允许您指定一个委托，该委托接收 `HttpContext` 对象和一个 `RequestDelegate` 委托作为参数。这使得您可以在中间件中手动调用下一个中间件，从而实现更灵活的请求处理逻辑。

```csharp
app.Use(async (context, next) =>
{
    // 手动调用下一个中间件
    await next(context);
});
```

### 7. 确保中间件顺序正确

中间件的顺序在 ASP.NET Core 中非常重要，因为它决定了请求和响应在管道中的执行顺序。每个中间件都依次处理请求，并有机会对请求进行操作，然后决定是否将请求传递给下一个中间件。

如果中间件的顺序不正确，可能会导致意外的行为，例如：
- 无法进行适当的身份验证或授权。
- 无法正确处理静态文件。
- 缺少必要的错误处理。

例如，身份验证中间件通常需要在授权中间件之前执行，以便在授权之前正确设置 `HttpContext.User`。

```csharp
public void Configure(IApplicationBuilder app)
{
    app.UseAuthentication(); // 必须在 UseAuthorization 之前
    app.UseAuthorization();
    app.UseStaticFiles(); // 必须在 UseRouting 之前
    app.UseRouting();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

#### 示例：中间件顺序的重要性

以下示例展示了中间件顺序如何影响请求的处理：

1. 日志记录中间件
2. 身份验证中间件
3. 自定义中间件
4. 终端中间件

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage(); // 错误处理中间件应在管道的开头
    }
    else
    {
        app.UseExceptionHandler("/Home/Error"); // 错误处理中间件应在管道的开头
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles(); // 提供静态文件服务，应在路由中间件之前

    app.UseRouting();

    app.UseAuthentication(); // 身份验证中间件
    app.UseAuthorization(); // 授权中间件

    app.UseMiddleware<CustomMiddleware>(); // 自定义中间件

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers(); // 终端中间件，用于处理最终请求
    });
}
```

#### 中间件执行顺序的示例

以下是一个更详细的示例，展示中间件执行顺序和请求处理的流程：

```csharp
public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.Use(async (context, next) =>
        {
            Console.WriteLine("Middleware 1: Before next()");
            await next.Invoke();
            Console.WriteLine("Middleware 1: After next()");
        });

        app.Use(async (context, next) =>
        {
            Console.WriteLine("Middleware 2: Before next()");
            await next.Invoke();
            Console.WriteLine("Middleware 2: After next()");
        });

        app.Run(async context =>
        {
            Console.WriteLine("Terminal Middleware: Handling request");
            await context.Response.WriteAsync("Hello, World!");
        });
    }
}
```

当您访问该应用时，控制台输出将如下所示：

```
Middleware 1: Before next()
Middleware 2: Before next()
Terminal Middleware: Handling request
Middleware 2: After next()
Middleware 1: After next()
```

这个输出展示了中间件的执行顺序。每个 `Use` 调用都会注册一个中间件组件，它们按照注册的顺序依次执行。

### 8. 对中间件管道进行分支

`Map` 扩展用作约定来创建管道分支。`Map` 基于给定请求路径的匹配项来创建请求管道分支。如果请求路径以给定路径开头，则执行分支。

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.Map("/map1", HandleMapTest1);
app.Map("/map2", HandleMapTest2);

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello from non-Map delegate.");
});

app.Run();

static void HandleMapTest1(IApplicationBuilder app)
{
    app.Run(async context =>
    {
        await context.Response.WriteAsync("Map Test 1");
    });
}

static void HandleMapTest2(IApplicationBuilder app)
{
    app.Run(async context =>
    {
        await context.Response.WriteAsync("Map Test 2");
    });
}
```

### 9. 使用 `MapWhen` 进行条件分支

`MapWhen` 基于给定谓词的结果创建请求管道分支。`Func<HttpContext, bool>` 类型的任何谓词均可用于将请求映射到管道的新分支。在以下示例中，谓词用于检测查询字符串变量是否存在。

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapWhen(context => context.Request.Query.ContainsKey("branch"), HandleBranch);

app.Run(async context =>
{
    await context.Response.WriteAsync("Hello from non-Map delegate.");
});

app.Run();

static void HandleBranch(IApplicationBuilder app)
{
    app.Run(async context =>
    {
        var branchVer = context.Request.Query["branch"];
        await context.Response.WriteAsync($"Branch used = {branchVer}");
    });
}
```

### 10. 使用 `UseWhen` 进行条件分支

`UseWhen` 也基于给定谓词的结果创建请求管道分支。与 `MapWhen` 不同的是，如果这个分支不发生短路或包含终端中间件，则会重新加入主管道。例如，以下示例中，如果请求中包含查询字符串变量，会记录其值并重新加入主管道。

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseWhen(context => context.Request.Query.ContainsKey("branch"),
    appBuilder => HandleBranchAndRejoin(appBuilder));

app.Run(asynccontext =>
{
    await context.Response.WriteAsync("Hello from non-Map delegate.");
});

app.Run();

void HandleBranchAndRejoin(IApplicationBuilder app)
{
    var logger = app.ApplicationServices.GetRequiredService<ILogger<Program>>(); 

    app.Use(async (context, next) =>
    {
        var branchVer = context.Request.Query["branch"];
        logger.LogInformation("Branch used = {branchVer}", branchVer);

        // Do work that doesn't write to the Response.
        await next();
        // Do other work that doesn't write to the Response.
    });
}
```

### 11. 内置中间件

ASP.NET Core 附带了许多内置中间件组件，它们提供了各种功能，例如身份验证、授权、静态文件服务等。这些中间件的顺序和特性对于应用程序的正确运行至关重要。以下是一些常用的内置中间件及其作用：

- **身份验证**：提供身份验证支持，通常在需要访问 `HttpContext.User` 之前执行。
- **授权**：提供授权支持，紧接在身份验证中间件之后执行。
- **静态文件**：为提供静态文件和目录浏览提供支持，通常作为终端中间件，如果请求与文件匹配，则为终端。
- **MVC**：使用 MVC/Razor Pages 处理请求，通常作为终端中间件，如果请求与路由匹配，则为终端。
- **开发者异常页面**：生成一个页面，其中包含仅适用于开发环境的错误信息，通常在其他错误处理中间件之前执行。
- **运行状况检查**：检查应用程序及其依赖项的运行状况，通常作为终端中间件，如果请求与运行状况检查终结点匹配，则为终端。

这些内置中间件在构建应用程序时提供了便利，但需要注意它们的顺序和条件以确保应用程序的正确运行。


## 四、配置

ASP.NET Core 提供了灵活且强大的配置系统，使开发者能够轻松地管理应用程序的配置设置。以下是关于 ASP.NET Core 中配置的一些关键概念和实现方法：

### 1. 配置源

ASP.NET Core 支持多种配置源，常见的包括：

- **文件**：如 `appsettings.json`、`appsettings.{Environment}.json`。
- **环境变量**：用于存储敏感数据或环境特定的配置。
- **命令行参数**：在应用启动时传递参数。
- **内存中**：用于在代码中直接设置配置。
- **用户机密**：用于本地开发时存储敏感数据。
- **Azure Key Vault**：用于在 Azure 环境中存储机密。
- **自定义配置源**：可以实现 `IConfigurationSource` 接口来自定义配置源。

### 2. 配置文件

在 ASP.NET Core 项目中，最常见的配置文件是 `appsettings.json`。以下是一个示例配置文件：

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft": "Warning",
            "Microsoft.Hosting.Lifetime": "Information"
        }
    },
    "AllowedHosts": "*",
    "ConnectionStrings": {
        "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=aspnet-CoreApp;Trusted_Connection=True;MultipleActiveResultSets=true"
    }
}
```

### 3. 配置加载顺序

ASP.NET Core 会按照以下顺序加载配置：

1. **默认配置**：应用程序的默认设置。
2. **应用配置文件**：如 `appsettings.json` 和 `appsettings.{Environment}.json`。
3. **用户机密**：仅在开发环境中加载。
4. **环境变量**：覆盖前面的配置。
5. **命令行参数**：覆盖所有前面的配置。

### 4. 读取配置

在 ASP.NET Core 中，通常使用 `IConfiguration` 接口来读取配置。以下是一个示例：

```csharp
public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // 读取配置值
        var mySetting = Configuration["MySetting"];
        var connectionString = Configuration.GetConnectionString("DefaultConnection");

        // 将配置对象注入到依赖注入容器中
        services.Configure<MySettings>(Configuration.GetSection("MySettings"));
    }
}
```

### 5. 强类型配置

为了更好地管理配置，可以将配置绑定到强类型对象中。以下是一个示例：

#### 5.1 定义配置类

```csharp
public class MySettings
{
    public string Setting1 { get; set; }
    public int Setting2 { get; set; }
}
```

#### 5.2 绑定配置

在 `Startup.cs` 中绑定配置：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<MySettings>(Configuration.GetSection("MySettings"));
}
```

#### 5.3 使用配置

通过依赖注入使用配置：

```csharp
public class MyService
{
    private readonly MySettings _settings;

    public MyService(IOptions<MySettings> settings)
    {
        _settings = settings.Value;
    }

    public void PrintSettings()
    {
        Console.WriteLine($"Setting1: {_settings.Setting1}");
        Console.WriteLine($"Setting2: {_settings.Setting2}");
    }
}
```

### 6. 环境特定的配置

ASP.NET Core 支持环境特定的配置文件，例如 `appsettings.Development.json` 和 `appsettings.Production.json`。在启动时，根据当前环境加载相应的配置文件。

#### 6.1 设置环境变量

在启动配置文件中设置环境变量，例如 `launchSettings.json`：

```json
{
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "MyApp": {
      "commandName": "Project",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

### 7. 用户机密

在开发环境中，用户机密用于存储敏感信息。使用 `dotnet user-secrets` 命令管理机密。

#### 7.1 启用用户机密

在项目文件（`.csproj`）中添加用户机密支持：

```xml
<PropertyGroup>
  <UserSecretsId>aspnet-CoreApp-123456</UserSecretsId>
</PropertyGroup>
```

#### 7.2 添加用户机密

使用命令行工具添加用户机密：

```bash
dotnet user-secrets set "MySecret" "secret_value"
```

#### 7.3 读取用户机密

在应用程序中读取用户机密：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    var mySecret = Configuration["MySecret"];
}
```

### 8. 自定义配置源

如果内置的配置源不能满足需求，可以实现自定义配置源。需要实现 `IConfigurationSource` 和 `IConfigurationProvider` 接口。

#### 8.1 实现自定义配置提供程序

```csharp
public class CustomConfigurationProvider : ConfigurationProvider
{
    public override void Load()
    {
        // 加载配置数据
        Data = new Dictionary<string, string>
        {
            { "CustomSetting:Setting1", "Value1" },
            { "CustomSetting:Setting2", "Value2" }
        };
    }
}
```

#### 8.2 实现自定义配置源

```csharp
public class CustomConfigurationSource : IConfigurationSource
{
    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new CustomConfigurationProvider();
    }
}
```

#### 8.3 注册自定义配置源

```csharp
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        var builder = new ConfigurationBuilder();
        builder.Add(new CustomConfigurationSource());
        var configuration = builder.Build();

        var customSetting1 = configuration["CustomSetting:Setting1"];
    }
}
```

通过以上方法，开发者可以灵活地配置和管理 ASP.NET Core 应用程序的设置，确保应用程序能够根据不同的环境和需求进行正确的配置。

## 五、日志

在 ASP.NET Core 中，日志记录是一项重要的任务，它能够帮助开发人员在应用程序中追踪、调试和监控事件。本文将介绍 ASP.NET Core 内置的日志记录功能，以及如何安装、配置和使用第三方日志记录提供程序 NLog。

### 1. 内置日志记录提供程序

#### 1.1 创建日志

在 ASP.NET Core 中，可以通过内置的 `ILogger` 接口创建日志记录器。例如：

```csharp
private readonly ILogger<MyController> _logger;

public MyController(ILogger<MyController> logger)
{
    _logger = logger;
}
```

#### 1.2 配置日志记录

ASP.NET Core 提供了灵活的日志记录配置选项，可以在 `appsettings.json` 文件中进行配置：

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

#### 1.3 日志级别

ASP.NET Core 内置了多个日志级别，包括 `Trace`、`Debug`、`Information`、`Warning`、`Error` 和 `Critical`。每个级别用于不同类型的日志消息，具体如下表所示：

LogLevel | 值 | 方法 | 说明
--- | --- | --- | ---
Trace | 0 | LogTrace | 包含最详细的消息。
Debug | 1 | LogDebug | 用于调试和开发。
Information | 2 | LogInformation | 跟踪应用的常规流。
Warning | 3 | LogWarning | 对于异常事件或意外事件。
Error | 4 | LogError | 表示无法处理的错误和异常。
Critical | 5 | LogCritical | 需要立即关注的失败。

#### 1.4 日志消息模板

每个日志消息都使用消息模板，可以包含要填充的参数占位符。例如：

```csharp
_logger.LogInformation("Getting item {Id}", id);
```

#### 1.5 记录异常

记录异常时，可以将异常对象传递给日志记录器方法的重载版本：

```csharp
try
{
    // Some code that may throw an exception
}
catch (Exception ex)
{
    _logger.LogError(ex, "An error occurred");
}
```

#### 1.6 默认日志级别

如果未在配置中设置默认日志级别，则默认的日志级别为 `Information`。可以通过以下方式设置默认日志级别：

```csharp
var builder = WebApplication.CreateBuilder();
builder.Logging.SetMinimumLevel(LogLevel.Warning);
```

通常，建议在配置文件中指定日志级别，而不是在代码中指定。

### 2. 第三方日志记录提供程序之 NLog

#### 2.1. 安装

要使用 NLog 作为日志记录提供程序，首先需要安装 NLog 包：

```bash
dotnet add package NLog.Web.AspNetCore
```

#### 2.2. 创建 `nlog.config` 文件：   

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      autoReload="true"
      internalLogLevel="Info"
      internalLogFile="c:\temp\internal-nlog-AspNetCore.txt">

  <!-- 启用 ASP.NET Core 布局渲染器 -->
  <extensions>
    <add assembly="NLog.Web.AspNetCore"/>
  </extensions>

  <!-- 日志写入目标 -->
  <targets>
    <!-- 用于记录所有日志消息的文件目标，包含基本细节 -->
    <target xsi:type="File" name="allfile" fileName="c:\temp\nlog-AspNetCore-all-${shortdate}.log"
            layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${logger}|${message} ${exception:format=tostring}" />

    <!-- 用于记录自身日志消息的文件目标，使用额外的 Web 详情，使用一些 ASP.NET Core 渲染器 -->
    <target xsi:type="File" name="ownFile-web" fileName="c:\temp\nlog-AspNetCore-own-${shortdate}.log"
            layout="${longdate}|${event-properties:item=EventId:whenEmpty=0}|${level:uppercase=true}|${logger}|${message} ${exception:format=tostring}|url: ${aspnet-request-url}|action: ${aspnet-mvc-action}" />

    <!-- 控制台目标，用于记录托管生命周期消息以改善 Docker/Visual Studio 启动检测 -->
    <target xsi:type="Console" name="lifetimeConsole" layout="${MicrosoftConsoleLayout}" />
  </targets>

  <!-- 将日志记录器名称映射到目标的规则 -->
  <rules>
    <!-- 所有日志，包括来自 Microsoft 的日志 -->
    <logger name="*" minlevel="Trace" writeTo="allfile" />

    <!-- 将托管生命周期消息输出到控制台目标，以加快启动检测 -->
    <logger name="Microsoft.Hosting.Lifetime" minlevel="Info" writeTo="lifetimeConsole, ownFile-web" final="true" />

    <!-- 跳过非关键的 Microsoft 日志，仅记录自身日志（黑洞） -->
    <logger name="Microsoft.*" maxlevel="Info" final="true" />
    <logger name="System.Net.Http.*" maxlevel="Info" final="true" />
    
    <logger name="*" minlevel="Trace" writeTo="ownFile-web" />
  </rules>
</nlog>

```

#### 2.3. 更新 `program.cs`

```csharp
using NLog;
using NLog.Web;

// 提前初始化 NLog，以便在构建主机之前进行启动和异常记录
var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("初始化主程序");

try
{
    var builder = WebApplication.CreateBuilder(args);

    // 将服务添加到容器中。
    builder.Services.AddControllersWithViews();

    // NLog：设置 NLog 以进行依赖项注入
    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    var app = builder.Build();

    // 配置 HTTP 请求管道。
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // 默认的 HSTS 值为 30 天。您可能希望针对生产环境更改此值，请参阅 https://aka.ms/aspnetcore-hsts。
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();

    app.UseAuthorization();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

    app.Run();
}
catch (Exception exception)
{
    // NLog：捕获设置错误
    logger.Error(exception, "由于异常停止程序");
    throw;
}
finally
{
    // 确保在应用程序退出之前刷新和停止内部计时器/线程（避免 Linux 上的分段错误）
    NLog.LogManager.Shutdown();
}

```

#### 2.4. Microsoft 日志记录过滤器

使用 `NLog 5.0` 时，默认情况下 `appsettings.json` 会忽略 `Microsoft` 日志记录筛选器。只需确保正确配置 `NLog` 配置规则即可。
```xml
<rules>
    <logger name="System.*" finalMinLevel="Warn" />
    <logger name="Microsoft.*" finalMinLevel="Warn" />
    <logger name="Microsoft.Hosting.Lifetime*" finalMinLevel="Info" />
    <logger name="*" minlevel="Trace" writeTo="ownFile-web" />
</rules>
```


如果指定 `RemoveLoggerFactoryFilter = false` 了 `NLog` 日志记录提供程序选项，则它将使用 `appsettings.json` 中指定的筛选器。请注意，也可以在 `appsettings.json` 中指定 `NLog` 配置。
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Trace",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

#### 2.5. 使用

在 ASP.NET Core 中，NLog 作为第三方日志记录提供程序，使用起来非常简单。只需按照上述配置步骤进行配置，然后就可以在代码中直接使用 `ILogger` 接口来记录日志，NLog 将自动将日志消息路由到相应的目的地。

```csharp
using Microsoft.Extensions.Logging;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
        _logger.LogDebug(1, "NLog injected into HomeController");
    }

    public IActionResult Index()
    {
        _logger.LogInformation("Hello, this is the index!");
        return View();
    }
}
```

#### 2.6. 示例输出
启动 ASP.NET Core 网站时，我们得到两个文件：

nlog-own-2024-05-29.log

```log
2024-05-29 18:35:23.9930|14|INFO|Microsoft.Hosting.Lifetime|Now listening on: https://localhost:7125 |url: |action: |Microsoft.AspNetCore.Hosting.GenericWebHostService.StartAsync
2024-05-29 18:35:23.9930|14|INFO|Microsoft.Hosting.Lifetime|Now listening on: http://localhost:5125 |url: |action: |Microsoft.AspNetCore.Hosting.GenericWebHostService.StartAsync
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Application started. Press Ctrl+C to shut down. |url: |action: |Microsoft.Extensions.Hosting.Internal.ConsoleLifetime.OnApplicationStarted
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Hosting environment: Development |url: |action: |Microsoft.Extensions.Hosting.Internal.ConsoleLifetime.OnApplicationStarted
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Content root path: C:\Users\snakefoot\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\ |url: |action: |Microsoft.Extensions.Hosting.Internal.ConsoleLifetime.OnApplicationStarted
2024-05-29 18:35:25.6656|1|DEBUG|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController|NLog injected into HomeController |url: https://localhost/|action: Index|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController..ctor
2024-05-29 18:35:25.6656|0|INFO|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController|Hello, this is the index! |url: https://localhost/|action: Index|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index
```

nlog-all-2024-05-29.log
```log
2024-05-29 18:35:15.1343|6|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Transport.Sockets|Connection id "0HMK16TVPK9JQ" received FIN. 
2024-05-29 18:35:15.1694|48|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16TVPK9JQ" is closed. The last processed stream ID was 29. 
2024-05-29 18:35:15.1694|7|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Transport.Sockets|Connection id "0HMK16TVPK9JQ" sending FIN because: "The client closed the connection." 
2024-05-29 18:35:15.1805|2|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Connections|Connection id "0HMK16TVPK9JQ" stopped. 
2024-05-29 18:35:23.6686|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/Home/Index.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/Home/Privacy.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/Shared/Error.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/Shared/_ValidationScriptsPartial.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/_ViewImports.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/_ViewStart.cshtml'. 
2024-05-29 18:35:23.7133|3|DEBUG|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Initializing Razor view compiler with compiled view: '/Views/Shared/_Layout.cshtml'. 
2024-05-29 18:35:23.7133|12|DEBUG|Microsoft.AspNetCore.Mvc.ModelBinding.ModelBinderFactory|Registered model binder providers, in the following order: Microsoft.AspNetCore.Mvc.ModelBinding.Binders.BinderTypeModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.ServicesModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.BodyModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.HeaderModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.FloatingPointTypeModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.EnumTypeModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.DateTimeModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.SimpleTypeModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.CancellationTokenModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.ByteArrayModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.FormFileModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.FormCollectionModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.KeyValuePairModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.DictionaryModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.ArrayModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.CollectionModelBinderProvider, Microsoft.AspNetCore.Mvc.ModelBinding.Binders.ComplexObjectModelBinderProvider 
2024-05-29 18:35:23.7746|1|DEBUG|Microsoft.Extensions.Hosting.Internal.Host|Hosting starting 
2024-05-29 18:35:23.8067|63|INFO|Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager|User profile is available. Using 'C:\Users\XXX\AppData\Local\ASP.NET\DataProtection-Keys' as key repository and Windows DPAPI to encrypt keys at rest. 
2024-05-29 18:35:23.8067|37|DEBUG|Microsoft.AspNetCore.DataProtection.Repositories.FileSystemXmlRepository|Reading data from file 'C:\Users\XXX\AppData\Local\ASP.NET\DataProtection-Keys\key-237c4f12-6703-4dd8-8e04-b904f77128d3.xml'. 
2024-05-29 18:35:23.8067|37|DEBUG|Microsoft.AspNetCore.DataProtection.Repositories.FileSystemXmlRepository|Reading data from file 'C:\Users\XXX\AppData\Local\ASP.NET\DataProtection-Keys\key-6c9a4248-29ef-409e-9349-fe5e287b835d.xml'. 
2024-05-29 18:35:23.8067|37|DEBUG|Microsoft.AspNetCore.DataProtection.Repositories.FileSystemXmlRepository|Reading data from file 'C:\Users\XXX\AppData\Local\ASP.NET\DataProtection-Keys\key-750f4bc0-7cc0-4ad8-809a-39972a95298d.xml'. 
2024-05-29 18:35:23.8067|37|DEBUG|Microsoft.AspNetCore.DataProtection.Repositories.FileSystemXmlRepository|Reading data from file 'C:\Users\XXX\AppData\Local\ASP.NET\DataProtection-Keys\key-dab65855-4eb4-4890-a09b-93b48ace1718.xml'. 
2024-05-29 18:35:23.8067|18|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager|Found key {237c4f12-6703-4dd8-8e04-b904f77128d3}. 
2024-05-29 18:35:23.8067|18|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager|Found key {6c9a4248-29ef-409e-9349-fe5e287b835d}. 
2024-05-29 18:35:23.8067|18|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager|Found key {750f4bc0-7cc0-4ad8-809a-39972a95298d}. 
2024-05-29 18:35:23.8067|18|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager|Found key {dab65855-4eb4-4890-a09b-93b48ace1718}. 
2024-05-29 18:35:23.8272|13|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.DefaultKeyResolver|Considering key {dab65855-4eb4-4890-a09b-93b48ace1718} with expiration date 2022-11-16 16:27:50Z as default key. 
2024-05-29 18:35:23.8272|0|DEBUG|Microsoft.AspNetCore.DataProtection.TypeForwardingActivator|Forwarded activator type request from Microsoft.AspNetCore.DataProtection.XmlEncryption.DpapiXmlDecryptor, Microsoft.AspNetCore.DataProtection, Version=6.0.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60 to Microsoft.AspNetCore.DataProtection.XmlEncryption.DpapiXmlDecryptor, Microsoft.AspNetCore.DataProtection, Culture=neutral, PublicKeyToken=adb9793829ddae60 
2024-05-29 18:35:23.8272|51|DEBUG|Microsoft.AspNetCore.DataProtection.XmlEncryption.DpapiXmlDecryptor|Decrypting secret element using Windows DPAPI. 
2024-05-29 18:35:23.8272|0|DEBUG|Microsoft.AspNetCore.DataProtection.TypeForwardingActivator|Forwarded activator type request from Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel.AuthenticatedEncryptorDescriptorDeserializer, Microsoft.AspNetCore.DataProtection, Version=6.0.0.0, Culture=neutral, PublicKeyToken=adb9793829ddae60 to Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.ConfigurationModel.AuthenticatedEncryptorDescriptorDeserializer, Microsoft.AspNetCore.DataProtection, Culture=neutral, PublicKeyToken=adb9793829ddae60 
2024-05-29 18:35:23.8367|4|DEBUG|Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.CngCbcAuthenticatedEncryptorFactory|Opening CNG algorithm 'AES' from provider '(null)' with chaining mode CBC. 
2024-05-29 18:35:23.8367|3|DEBUG|Microsoft.AspNetCore.DataProtection.AuthenticatedEncryption.CngCbcAuthenticatedEncryptorFactory|Opening CNG algorithm 'SHA256' from provider '(null)' with HMAC. 
2024-05-29 18:35:23.8367|2|DEBUG|Microsoft.AspNetCore.DataProtection.KeyManagement.KeyRingProvider|Using key {dab65855-4eb4-4890-a09b-93b48ace1718} as the default key. 
2024-05-29 18:35:23.8367|65|DEBUG|Microsoft.AspNetCore.DataProtection.Internal.DataProtectionHostedService|Key ring with default key {dab65855-4eb4-4890-a09b-93b48ace1718} was loaded during application startup. 
2024-05-29 18:35:23.9534|0|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServer|Using development certificate: CN=localhost (Thumbprint: 3271A3360CD4E4DC9058F84E9FB3A1E651D0F7C9) 
2024-05-29 18:35:23.9930|14|INFO|Microsoft.Hosting.Lifetime|Now listening on: https://localhost:7125 
2024-05-29 18:35:23.9930|14|INFO|Microsoft.Hosting.Lifetime|Now listening on: http://localhost:5125 
2024-05-29 18:35:24.0084|13|DEBUG|Microsoft.AspNetCore.Hosting.Diagnostics|Loaded hosting startup assembly ASP.NetCore6_NLog_Web_Example 
2024-05-29 18:35:24.0084|13|DEBUG|Microsoft.AspNetCore.Hosting.Diagnostics|Loaded hosting startup assembly Microsoft.AspNetCore.Watch.BrowserRefresh 
2024-05-29 18:35:24.0084|13|DEBUG|Microsoft.AspNetCore.Hosting.Diagnostics|Loaded hosting startup assembly Microsoft.WebTools.BrowserLink.Net 
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Application started. Press Ctrl+C to shut down. 
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Hosting environment: Development 
2024-05-29 18:35:24.0084|0|INFO|Microsoft.Hosting.Lifetime|Content root path: C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\ 
2024-05-29 18:35:24.0084|2|DEBUG|Microsoft.Extensions.Hosting.Internal.Host|Hosting started 
2024-05-29 18:35:24.4292|39|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Connections|Connection id "0HMK16UJ982TR" accepted. 
2024-05-29 18:35:24.4292|39|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Connections|Connection id "0HMK16UJ982TQ" accepted. 
2024-05-29 18:35:24.4306|1|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Connections|Connection id "0HMK16UJ982TQ" started. 
2024-05-29 18:35:24.4306|1|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Connections|Connection id "0HMK16UJ982TR" started. 
2024-05-29 18:35:24.4533|6|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Transport.Sockets|Connection id "0HMK16UJ982TQ" received FIN. 
2024-05-29 18:35:24.4533|6|DEBUG|Microsoft.AspNetCore.Server.Kestrel.Transport.Sockets|Connection id "0HMK16UJ982TR" received FIN. 
2024-05-29 18:35:25.5421|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/ - - 
2024-05-29 18:35:25.5892|0|DEBUG|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|Wildcard detected, all requests with hosts will be allowed. 
2024-05-29 18:35:25.5892|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:25.5892|4|DEBUG|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|The request path / does not match a supported file type 
2024-05-29 18:35:25.6168|1001|DEBUG|Microsoft.AspNetCore.Routing.Matching.DfaMatcher|1 candidate(s) found for the request path '/' 
2024-05-29 18:35:25.6198|1005|DEBUG|Microsoft.AspNetCore.Routing.Matching.DfaMatcher|Endpoint 'ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example)' with route pattern '{controller=Home}/{action=Index}/{id?}' is valid for the request path '/' 
2024-05-29 18:35:25.6198|1|DEBUG|Microsoft.AspNetCore.Routing.EndpointRoutingMiddleware|Request matched endpoint 'ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example)' 
2024-05-29 18:35:25.6198|0|INFO|Microsoft.AspNetCore.Routing.EndpointMiddleware|Executing endpoint 'ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example)' 
2024-05-29 18:35:25.6595|3|INFO|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Route matched with {action = "Index", controller = "Home"}. Executing controller action with signature Microsoft.AspNetCore.Mvc.IActionResult Index() on controller ASP.NetCore6_NLog_Web_Example.Controllers.HomeController (ASP.NetCore6_NLog_Web_Example). 
2024-05-29 18:35:25.6595|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Execution plan of authorization filters (in the following order): None 
2024-05-29 18:35:25.6595|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Execution plan of resource filters (in the following order): Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter 
2024-05-29 18:35:25.6595|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Execution plan of action filters (in the following order): Microsoft.AspNetCore.Mvc.Filters.ControllerActionFilter (Order: -2147483648), Microsoft.AspNetCore.Mvc.ModelBinding.UnsupportedContentTypeFilter (Order: -3000) 
2024-05-29 18:35:25.6595|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Execution plan of exception filters (in the following order): None 
2024-05-29 18:35:25.6595|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Execution plan of result filters (in the following order): Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter 
2024-05-29 18:35:25.6656|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Resource Filter: Before executing OnResourceExecuting on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.6656|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Resource Filter: After executing OnResourceExecuting on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.6656|1|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Executing controller factory for controller ASP.NetCore6_NLog_Web_Example.Controllers.HomeController (ASP.NetCore6_NLog_Web_Example) 
2024-05-29 18:35:25.6656|1|DEBUG|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController|NLog injected into HomeController 
2024-05-29 18:35:25.6656|2|DEBUG|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Executed controller factory for controller ASP.NetCore6_NLog_Web_Example.Controllers.HomeController (ASP.NetCore6_NLog_Web_Example) 
2024-05-29 18:35:25.6656|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: Before executing OnActionExecutionAsync on filter Microsoft.AspNetCore.Mvc.Filters.ControllerActionFilter. 
2024-05-29 18:35:25.6656|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: Before executing OnActionExecuting on filter Microsoft.AspNetCore.Mvc.ModelBinding.UnsupportedContentTypeFilter. 
2024-05-29 18:35:25.6656|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: After executing OnActionExecuting on filter Microsoft.AspNetCore.Mvc.ModelBinding.UnsupportedContentTypeFilter. 
2024-05-29 18:35:25.6656|1|INFO|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Executing action method ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example) - Validation state: Valid 
2024-05-29 18:35:25.6656|0|INFO|ASP.NetCore6_NLog_Web_Example.Controllers.HomeController|Hello, this is the index! 
2024-05-29 18:35:25.6831|2|INFO|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Executed action method ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example), returned result Microsoft.AspNetCore.Mvc.ViewResult in 2.7721ms. 
2024-05-29 18:35:25.6831|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: Before executing OnActionExecuted on filter Microsoft.AspNetCore.Mvc.ModelBinding.UnsupportedContentTypeFilter. 
2024-05-29 18:35:25.6831|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: After executing OnActionExecuted on filter Microsoft.AspNetCore.Mvc.ModelBinding.UnsupportedContentTypeFilter. 
2024-05-29 18:35:25.6831|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Action Filter: After executing OnActionExecutionAsync on filter Microsoft.AspNetCore.Mvc.Filters.ControllerActionFilter. 
2024-05-29 18:35:25.6831|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Result Filter: Before executing OnResultExecuting on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.6831|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Result Filter: After executing OnResultExecuting on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.6831|4|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Before executing action result Microsoft.AspNetCore.Mvc.ViewResult. 
2024-05-29 18:35:25.6831|1|DEBUG|Microsoft.AspNetCore.Mvc.Razor.RazorViewEngine|View lookup cache miss for view 'Index' in controller 'Home'. 
2024-05-29 18:35:25.6831|5|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Located compiled view for view at path '/Views/Home/Index.cshtml'. 
2024-05-29 18:35:25.6831|7|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Could not find a file for view at path '/Views/Home/_ViewStart.cshtml'. 
2024-05-29 18:35:25.6831|5|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Located compiled view for view at path '/Views/_ViewStart.cshtml'. 
2024-05-29 18:35:25.6831|7|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Could not find a file for view at path '/_ViewStart.cshtml'. 
2024-05-29 18:35:25.6960|1|INFO|Microsoft.AspNetCore.Mvc.ViewFeatures.ViewResultExecutor|Executing ViewResult, running view Index. 
2024-05-29 18:35:25.6960|2|DEBUG|Microsoft.AspNetCore.Mvc.ViewFeatures.ViewResultExecutor|The view path '/Views/Home/Index.cshtml' was found in 9.3119ms. 
2024-05-29 18:35:25.7393|1|DEBUG|Microsoft.AspNetCore.Mvc.Razor.RazorViewEngine|View lookup cache miss for view '_Layout' in controller 'Home'. 
2024-05-29 18:35:25.7393|7|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Could not find a file for view at path '/Views/Home/_Layout.cshtml'. 
2024-05-29 18:35:25.7393|5|TRACE|Microsoft.AspNetCore.Mvc.Razor.Compilation.DefaultViewCompiler|Located compiled view for view at path '/Views/Shared/_Layout.cshtml'. 
2024-05-29 18:35:25.7816|100|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Found the endpoints Route: {controller=Home}/{action=Index}/{id?} for address Microsoft.AspNetCore.Routing.RouteValuesAddress 
2024-05-29 18:35:25.7899|102|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Successfully processed template {controller=Home}/{action=Index}/{id?} for Route: {controller=Home}/{action=Index}/{id?} resulting in  and  
2024-05-29 18:35:25.7899|105|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Link generation succeeded for endpoints Route: {controller=Home}/{action=Index}/{id?} with result / 
2024-05-29 18:35:25.7899|100|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Found the endpoints Route: {controller=Home}/{action=Index}/{id?} for address Microsoft.AspNetCore.Routing.RouteValuesAddress 
2024-05-29 18:35:25.7899|102|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Successfully processed template {controller=Home}/{action=Index}/{id?} for Route: {controller=Home}/{action=Index}/{id?} resulting in  and  
2024-05-29 18:35:25.7899|105|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Link generation succeeded for endpoints Route: {controller=Home}/{action=Index}/{id?} with result / 
2024-05-29 18:35:25.7899|100|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Found the endpoints Route: {controller=Home}/{action=Index}/{id?} for address Microsoft.AspNetCore.Routing.RouteValuesAddress 
2024-05-29 18:35:25.7899|102|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Successfully processed template {controller=Home}/{action=Index}/{id?} for Route: {controller=Home}/{action=Index}/{id?} resulting in /Home/Privacy and  
2024-05-29 18:35:25.7899|105|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Link generation succeeded for endpoints Route: {controller=Home}/{action=Index}/{id?} with result /Home/Privacy 
2024-05-29 18:35:25.7899|100|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Found the endpoints Route: {controller=Home}/{action=Index}/{id?} for address Microsoft.AspNetCore.Routing.RouteValuesAddress 
2024-05-29 18:35:25.7899|102|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Successfully processed template {controller=Home}/{action=Index}/{id?} for Route: {controller=Home}/{action=Index}/{id?} resulting in /Home/Privacy and  
2024-05-29 18:35:25.7899|105|DEBUG|Microsoft.AspNetCore.Routing.DefaultLinkGenerator|Link generation succeeded for endpoints Route: {controller=Home}/{action=Index}/{id?} with result /Home/Privacy 
2024-05-29 18:35:25.9178|4|INFO|Microsoft.AspNetCore.Mvc.ViewFeatures.ViewResultExecutor|Executed ViewResult - view Index executed in 231.1047ms. 
2024-05-29 18:35:25.9178|5|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|After executing action result Microsoft.AspNetCore.Mvc.ViewResult. 
2024-05-29 18:35:25.9178|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Result Filter: Before executing OnResultExecuted on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.9178|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Result Filter: After executing OnResultExecuted on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.9178|2|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Resource Filter: Before executing OnResourceExecuted on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.9178|3|TRACE|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Resource Filter: After executing OnResourceExecuted on filter Microsoft.AspNetCore.Mvc.ViewFeatures.Filters.SaveTempDataFilter. 
2024-05-29 18:35:25.9178|2|INFO|Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker|Executed action ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example) in 261.5085ms 
2024-05-29 18:35:25.9178|1|INFO|Microsoft.AspNetCore.Routing.EndpointMiddleware|Executed endpoint 'ASP.NetCore6_NLog_Web_Example.Controllers.HomeController.Index (ASP.NetCore6_NLog_Web_Example)' 
2024-05-29 18:35:25.9417|1|DEBUG|Microsoft.AspNetCore.Watch.BrowserRefresh.BrowserRefreshMiddleware|Response markup is scheduled to include browser refresh script injection. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 1 with length 67 and flags END_HEADERS. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 1024 and flags NONE. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 1024 and flags NONE. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 917 and flags NONE. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 65 and flags NONE. 
2024-05-29 18:35:25.9571|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 18 and flags NONE. 
2024-05-29 18:35:25.9749|2|DEBUG|Microsoft.AspNetCore.Watch.BrowserRefresh.BrowserRefreshMiddleware|Response markup was updated to include browser refresh script injection. 
2024-05-29 18:35:25.9834|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 1 with length 0 and flags END_STREAM. 
2024-05-29 18:35:25.9962|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/ - - - 200 - text/html;+charset=utf-8 456.1640ms 
2024-05-29 18:35:26.0191|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 3 with length 106 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 5 with length 67 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 7 with length 91 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/css/site.css?v=AKvNjO3dCPPS0eSU1Ez8T2wI280i08yGycV9ndytL-c - - 
2024-05-29 18:35:26.0257|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/lib/bootstrap/dist/css/bootstrap.min.css - - 
2024-05-29 18:35:26.0257|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0257|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 9 with length 55 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 11 with length 55 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 13 with length 67 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 15 with length 52 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|37|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" received HEADERS frame for stream ID 17 with length 34 and flags END_STREAM, END_HEADERS, PRIORITY. 
2024-05-29 18:35:26.0257|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/ASP.NetCore6_NLog_Web_Example.styles.css?v=RE8iCRyLdOMjrQXlLNeo4W3xw0k_zNKqvYCiPxC_9nE - - 
2024-05-29 18:35:26.0257|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0416|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/lib/jquery/dist/jquery.min.js - - 
2024-05-29 18:35:26.0416|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/lib/bootstrap/dist/js/bootstrap.bundle.min.js - - 
2024-05-29 18:35:26.0416|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 7 with length 77 and flags END_HEADERS. 
2024-05-29 18:35:26.0416|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 7 with length 1146 and flags NONE. 
2024-05-29 18:35:26.0416|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 9 with length 86 and flags END_HEADERS. 
2024-05-29 18:35:26.0416|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/ASP.NetCore6_NLog_Web_Example.styles.css'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\obj\Debug\net6.0\scopedcss\bundle\ASP.NetCore6_NLog_Web_Example.styles.css' 
2024-05-29 18:35:26.0416|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 7 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.0416|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/ASP.NetCore6_NLog_Web_Example.styles.css?v=RE8iCRyLdOMjrQXlLNeo4W3xw0k_zNKqvYCiPxC_9nE - - - 200 1146 text/css 15.8363ms 
2024-05-29 18:35:26.0416|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/js/site.js?v=4q1jwFhaPaZgr8WAUSrux6hAuh0XDg9kPS3xIVq36I0 - - 
2024-05-29 18:35:26.0416|2|TRACE|Microsoft.AspNetCore.HostFiltering.HostFilteringMiddleware|All hosts are allowed. 
2024-05-29 18:35:26.0416|0|TRACE|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Range header's value is empty. 
2024-05-29 18:35:26.0416|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 16384 and flags NONE. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 11 with length 33 and flags END_HEADERS. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 16384 and flags NONE. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 3 with length 34 and flags END_HEADERS. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.0553|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/_framework/aspnetcore-browser-refresh.js - - 
2024-05-29 18:35:26.0553|1|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request starting HTTP/2 GET https://localhost:7125/_vs/browserLink - - 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 5 with length 31 and flags END_HEADERS. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 13 with length 31 and flags END_HEADERS. 
2024-05-29 18:35:26.0553|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 16384 and flags NONE. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 5 with length 194 and flags NONE. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 16384 and flags NONE. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 13 with length 230 and flags NONE. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 15 with length 60 and flags END_HEADERS. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 15 with length 12024 and flags NONE. 
2024-05-29 18:35:26.0924|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending HEADERS frame for stream ID 17 with length 119 and flags END_HEADERS. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 9986 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1097|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 15 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/_framework/aspnetcore-browser-refresh.js - - - 200 12024 application/javascript;+charset=utf-8 55.1341ms 
2024-05-29 18:35:26.1195|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/css/site.css'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\wwwroot\css\site.css' 
2024-05-29 18:35:26.1195|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/js/site.js'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\wwwroot\js\site.js' 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 5 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1195|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/css/site.css?v=AKvNjO3dCPPS0eSU1Ez8T2wI280i08yGycV9ndytL-c - - - 200 194 text/css 94.5017ms 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 13 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1195|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/js/site.js?v=4q1jwFhaPaZgr8WAUSrux6hAuh0XDg9kPS3xIVq36I0 - - - 200 230 application/javascript 77.4123ms 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1195|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 12938 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 7558 and flags NONE. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/lib/jquery/dist/jquery.min.js'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\wwwroot\lib\jquery\dist\jquery.min.js' 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 9 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/lib/bootstrap/dist/js/bootstrap.bundle.min.js'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\wwwroot\lib\bootstrap\dist\js\bootstrap.bundle.min.js' 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/lib/jquery/dist/jquery.min.js - - - 200 89478 application/javascript 93.8938ms 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 11 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/lib/bootstrap/dist/js/bootstrap.bundle.min.js - - - 200 78474 application/javascript 93.0748ms 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 10240 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 9975 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 16384 and flags NONE. 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 15270 and flags NONE. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.StaticFiles.StaticFileMiddleware|Sending file. Request path: '/lib/bootstrap/dist/css/bootstrap.min.css'. Physical path: 'C:\Users\XXX\source\repos\NLog.Web\examples\ASP.NET Core 6\ASP.NET Core 6 NLog Example\wwwroot\lib\bootstrap\dist\css\bootstrap.min.css' 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 3 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/lib/bootstrap/dist/css/bootstrap.min.css - - - 200 162726 text/css 109.3089ms 
2024-05-29 18:35:26.1329|49|TRACE|Microsoft.AspNetCore.Server.Kestrel.Http2|Connection id "0HMK16UJ982TT" sending DATA frame for stream ID 17 with length 0 and flags END_STREAM. 
2024-05-29 18:35:26.1329|2|INFO|Microsoft.AspNetCore.Hosting.Diagnostics|Request finished HTTP/2 GET https://localhost:7125/_vs/browserLink - - - 200 - text/javascript;+charset=UTF-8 71.3116ms 
```


## 六、模型绑定

下面是对应的 URL 示例：

### 1. 路由参数

#### 接收单个参数

```csharp
[HttpGet("api/products/{id}")]
public IActionResult GetProductById([FromRoute] int id)
{
    return Ok();
}
```

对应的 URL 示例：`/api/products/123`

### 2. URL 参数

#### 接收单个参数

```csharp
[HttpGet("api/products")]
public IActionResult GetProducts([FromQuery] int page)
{
    return Ok();
}
```

对应的 URL 示例：`/api/products?page=1`

#### 接收数组参数

```csharp
[HttpGet("api/products")]
public IActionResult GetProducts([FromQuery(Name = "ids[]")] int[] ids)
{
    return Ok();
}
```

对应的 URL 示例：`/api/products?ids[]=1&ids[]=2&ids[]=3`

#### 接收对象参数

```csharp
[HttpGet("api/products")]
public IActionResult GetProducts([FromQuery] Product product)
{
    return Ok();
}
```

对应的 URL 示例：`/api/products?Name=ProductName&Price=99.99`

### 3. 请求体参数

#### 接收单个参数

```csharp
[HttpPost("api/products")]
public IActionResult CreateProduct([FromBody] string productName)
{
    return Ok();
}
```

对应的请求体示例：

```json
{
    "productName": "Product Name"
}
```

#### 接收数组参数

```csharp
[HttpPost("api/products")]
public IActionResult CreateProducts([FromBody] List<string> productNames)
{
    return Ok();
}
```

对应的请求体示例：

```json
["Product 1", "Product 2", "Product 3"]
```

#### 接收对象参数

```csharp
[HttpPost("api/products")]
public IActionResult CreateProduct([FromBody] Product product)
{
    return Ok();
}
```

对应的请求体示例：

```json
{
    "id": 123,
    "name": "Product Name",
    "price": 99.99
}
```

这些示例展示了在 ASP.NET Core Web API 中如何从路由、URL 和请求体中接收参数，并进行相应的参数绑定。

## 七、模型验证

在 Web API 中，模型验证是确保客户端提供的数据符合预期的关键部分之一。这不仅有助于保护应用程序免受恶意输入的影响，还可以提高应用程序的健壮性和可靠性。

### 1. 内置验证特性

ASP.NET Core 提供了一系列内置的验证特性，可以直接应用于模型的属性上。通过在模型的属性上应用这些特性，我们可以定义属性的验证规则和错误消息，以确保接收到的数据是有效的和完整的。

示例：

```csharp
using System.ComponentModel.DataAnnotations;

public class UserModel
{
    [Required(ErrorMessage = "用户名不能为空")]
    public string Username { get; set; }

    [Required(ErrorMessage = "密码不能为空")]
    [StringLength(20, MinimumLength = 6, ErrorMessage = "密码长度必须在6到20个字符之间")]
    public string Password { get; set; }

    [EmailAddress(ErrorMessage = "无效的邮箱地址")]
    public string Email { get; set; }

    [Range(18, 100, ErrorMessage = "年龄必须在18到100岁之间")]
    public int Age { get; set; }

    [Phone(ErrorMessage = "无效的电话号码")]
    public string PhoneNumber { get; set; }

    [RegularExpression(@"^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$", ErrorMessage = "用户名只能包含字母、数字、下划线和短横线")]
    public string Username { get; set; }

    [Compare("Password", ErrorMessage = "确认密码与密码不匹配")]
    public string ConfirmPassword { get; set; }

    [Url(ErrorMessage = "无效的 URL 地址")]
    public string Website { get; set; }

    [CreditCard(ErrorMessage = "无效的信用卡号")]
    public string CreditCardNumber { get; set; }

    [DataType(DataType.Date, ErrorMessage = "请输入有效的日期")]
    public DateTime BirthDate { get; set; }
}

```

### 2. 手动验证获取参数绑定失败的消息

有时候，我们需要手动获取参数绑定失败的消息。为了实现这一点，我们可以创建一个静态的 AspNetCoreHelper 类，其中包含一个 ValidateModelStateForApi 方法，用于验证模型的状态并获取绑定失败的消息。

```csharp
public static class AspNetCoreHelper
{
    public static void ValidateModelStateForApi(ModelStateDictionary modelState)
    {
        if (!modelState.IsValid)
        {
            var errorMessages = string.Join(Environment.NewLine,
                modelState.Values.SelectMany(v => v.Errors.Select(e => !string.IsNullOrEmpty(e.ErrorMessage) ? e.ErrorMessage : e.Exception?.Message)));

            if (!string.IsNullOrEmpty(errorMessages))
            {
                throw new Exception(errorMessages);
            }
        }
    }
}
```

### 3. 进阶使用 FluentValidation 自定义规则更灵活的验证参数

FluentValidation 是一个强大且灵活的验证库，可以用于定义复杂的验证规则。以下是使用 FluentValidation 进行模型验证的简单教程：

### 3.1. 安装 FluentValidation 包

首先，使用 NuGet 包管理器或 .NET CLI 安装 FluentValidation 包。

```bash
dotnet add package FluentValidation
```

### 3.2. 创建验证器类

创建一个验证器类，用于定义模型验证规则。例如，如果我们有一个名为 `Product` 的模型类，可以创建一个 `ProductValidator` 的验证器类来定义验证规则。

```csharp
using FluentValidation;

public class ProductValidator : AbstractValidator<Product>
{
    public ProductValidator()
    {
        RuleFor(product => product.Name).NotEmpty().WithMessage("Name is required.");
        RuleFor(product => product.Price).GreaterThan(0).WithMessage("Price must be greater than 0.");
    }
}
```

### 3.3. 在控制器中使用验证器

在控制器中使用验证器类来执行模型验证。在控制器的相应动作方法中，实例化验证器并对模型对象进行验证。

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateProduct([FromBody] Product product)
    {
        var validator = new ProductValidator();
        var validationResult = validator.Validate(product);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(error => error.ErrorMessage);
            return BadRequest(errors);
        }

        // 执行创建产品的逻辑
        return Ok("Product created successfully!");
    }
}
```

### 3.4. 测试模型验证

通过发送 POST 请求来测试模型验证。可以使用 Postman 或其他 HTTP 客户端来发送请求。

- URL：`POST /api/products`
- 请求体：JSON 格式的产品数据

```json
{
    "name": "Product Name",
    "price": 99.99
}
```

## 八、使用 Swagger 构建 Web API 文档

Swagger 是一个流行的 Web API 文档工具，可以帮助开发人员设计、构建、记录和使用 API。在 ASP.NET Core 中，使用 Swagger 可以轻松地生成易懂的 Web API 文档，并解决一些常见的问题。下面是一份通俗易懂的使用 Swagger 的指南，同时也提供了一些常见问题的解决方案。

### 1. 安装 Swagger

首先，我们需要在 ASP.NET Core 项目中安装 Swagger 相关的 NuGet 包。

1. 打开 NuGet 包管理器控制台。
2. 运行以下命令来安装 Swashbuckle.AspNetCore：

```bash
Install-Package Swashbuckle.AspNetCore
```

### 2. 配置 Swagger

在项目的 `Startup.cs` 文件中配置 Swagger 服务。

1. 在 `ConfigureServices` 方法中，添加 Swagger 服务的配置：

```csharp
services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Your API Name", Version = "v1" });
});
```

2. 在 `Configure` 方法中启用 Swagger 中间件：

```csharp
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API V1");
});
```

### 3. 添加中文注释

如果你希望在 Swagger 文档中显示中文注释，可以进行如下配置。

1. 在项目的属性中，启用 XML 文档生成。
2. 在 `ConfigureServices` 方法中，添加 XML 文档的注释路径：

```csharp
services.AddSwaggerGen(c =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename), true);
});
```

### 5. 添加身份验证令牌

在 `ConfigureServices` 方法中配置 Swagger。

```csharp
    services.AddSwaggerGen(c =>
    {
        // 配置 Swagger 文档的安全定义
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT授权token前面需要加上字段Bearer与一个空格,如Bearer token",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        // 添加 Swagger 文档的全局安全要求
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                },
                new string[] {}
            }
        });
    });
```

### 4. 解决常见问题

#### 4.1. 使用相同类名的 Schema 会导致报错

如果在项目中存在相同类名的情况，可以通过配置避免这个问题。

在 `ConfigureServices` 方法中，添加如下配置：

```csharp
services.AddSwaggerGen(c =>
{
    c.CustomSchemaIds(type => SwaggerHelper.GetSchemaId(type));
})
```
自定义 **SchemaId**   如下：

```csharp
    public static class SwaggerHelper
    {
        private static readonly ConcurrentDictionary<string, int> _schemaNameRepetition = new();

        private static string DefaultSchemaIdSelector(Type modelType)
        {
            if (!modelType.IsConstructedGenericType) return modelType.Name.Replace("[]", "Array");

            var prefixBuilder = new StringBuilder();
            foreach (var genericArg in modelType.GetGenericArguments())
            {
                prefixBuilder.Append(DefaultSchemaIdSelector(genericArg));
            }

            var prefix = prefixBuilder.ToString();
            return prefix + modelType.Name.Split('`').First();
        }

        public static string GetSchemaId(Type modelType)
        {
            string id;
            id = DefaultSchemaIdSelector(modelType);
            _schemaNameRepetition.AddOrUpdate(id, 1, (_, count) => count + 1);

            int count = _schemaNameRepetition[id];


            return $"{id}{(count > 1 ? count.ToString() : "")}";
        }
    }
```


#### 4.2. 接口返回数据字段变成小写

有时接口返回的数据字段会变成小写，可以通过配置解决。

在 `Startup.cs` 文件的 `ConfigureServices` 方法中，添加如下配置：

```csharp
services.AddControllers()
    .AddNewtonsoftJson(op =>
    {
        // 解决接口返回的字段变成小写问题，还原模型原本的字段名
        op.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
    });
```


## 九、使用 EF Core 操作数据库

当使用 CLI 工具初始化模型并从配置文件中读取数据库连接字符串时，可以按照以下步骤进行操作：

### 1. 安装 Entity Framework Core CLI 工具

首先，确保已经安装了 Entity Framework Core 工具。你可以通过以下命令来全局安装 EF Core 工具：

```bash
dotnet tool install --global dotnet-ef
```

这将安装 EF Core 工具，使你可以在命令行或终端中使用 `dotnet ef` 命令。


### 2. 安装 EF Core 包

在项目目录中安装 Entity Framework Core 包。可以使用 NuGet 包管理器或 .NET CLI 来安装。

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

### 3. 使用 CLI 工具初始化模型

#### 常用选项

| 选项                 | Short | 说明                                                         |
| :------------------- | :---- | :----------------------------------------------------------- |
| `--json`             |       | 显示 JSON 输出。                                             |
| `--context `         | `-c`  | 要使用的 `DbContext` 类。 仅类名或完全限定命名的空间。 如果省略此选项，EF Core 将查找上下文类。 如果有多个上下文类，则此选项是必需的。 |
| `--project `         | `-p`  | 目标项目的项目文件夹的相对路径。 默认值是当前文件夹。        |
| `--startup-project ` | `-s`  | 启动项目的项目文件夹的相对路径。 默认值是当前文件夹。        |
| `--framework `       |       | [目标框架](https://learn.microsoft.com/zh-cn/dotnet/standard/frameworks)的[目标框架名字对象](https://learn.microsoft.com/zh-cn/dotnet/standard/frameworks#supported-target-framework-versions)。 当项目文件指定了多个目标框架，并且你想要选择其中一个目标框架时，请使用此选项。 |
| `--configuration `   |       | 生成配置，例如 `Debug` 或 `Release`。                        |
| `--runtime `         |       | 要为其还原包的目标运行时的标识符。 有关运行时标识符 (RID) 的列表，请参阅 [RID 目录](https://learn.microsoft.com/zh-cn/dotnet/core/rid-catalog)。 |
| `--no-build`         |       | 请勿生成项目。 旨在在生成处于最新状态时使用。                |
| `--help`             | `-h`  | 显示帮助信息。                                               |
| `--verbose`          | `-v`  | 显示详细输出。                                               |
| `--no-color`         |       | 请勿为输出着色。                                             |
| `--prefix-output`    |       | 具有级别的前缀输出。                                         |

首先，在项目的根目录下打开命令行或终端窗口，并使用 EF Core CLI 工具来初始化模型类。

```bash
dotnet ef dbcontext scaffold "connection_string_here" Microsoft.EntityFrameworkCore.SqlServer -o Models -c ApplicationDbContext --data-annotations -f --no-pluralize
```

替换 `"connection_string_here"` 为你的数据库连接字符串，`-o Models` 参数指定了模型类文件的输出目录。这个命令会根据数据库的结构自动生成模型类文件。

#### `dotnet ef dbcontext scaffold`

为 `DbContext` 生成代码，并为数据库生成实体类型。 为了让此命令生成实体类型，数据库表必须具有主键。

参数：

| 参数         | 说明                                                         |
| :----------- | :----------------------------------------------------------- |
| `<CONNECTION>` | 用于连接到数据库的连接字符串。 对于 ASP.NET Core 2.x 项目，值可以是 name=<name of connection string>。 在这种情况下，名称来自为项目设置的配置源。 |
| `<PROVIDER>`   | 要使用的提供程序。 通常，这是 NuGet 包的名称，例如：`Microsoft.EntityFrameworkCore.SqlServer`。 |

选项：

| 选项                   | Short | 说明                                                         |
| :--------------------- | :---- | :----------------------------------------------------------- |
| `--data-annotations`   | `-d`  | 使用属性配置模型（如果可能）。 如果省略此选项，则仅使用 Fluent API。 |
| `--context `           | `-c`  | 要生成的 `DbContext` 类的名称。                              |
| `--context-dir `       |       | 要在其中放置 `DbContext` 类文件的目录。 路径相对于项目目录。 命名空间派生自文件夹名称。 |
| `--context-namespace ` |       | 要用于生成的 `DbContext` 类的命名空间。 注意：重写 `--namespace`。 |
| `--force`              | `-f`  | 覆盖现有文件。                                               |
| `--output-dir `        | `-o`  | 要在其中放置实体类文件的目录。 路径相对于项目目录。          |
| `--namespace `         | `-n`  | 要用于所有生成的类的命名空间。 默认设置为从根命名空间和输出目录生成。 |
| `--schema ...`         |       | 要为其生成实体类型的表和视图的架构。 若要指定多个架构，请为每个架构重复 `--schema`。 如果省略此选项，则包含所有架构。 如果使用此选项，架构中的所有表和视图都将包含在模型中，即使未使用 --table 显式包含它们也是如此。 |
| `--table ...`          | `-t`  | 要为其生成实体类型的表和视图。 若要指定多个表，请为每个表重复 `-t` 或 `--table`。 可以使用“schema.table”或“schema.view”格式包含特定架构中的表或视图。 如果省略此选项，则包含所有表和视图。 |
| `--use-database-names` |       | 使用与数据库中显示的名称完全相同的表、视图、序列和列名称。 如果省略此选项，数据库名称将更改为更符合 C# 名称样式约定。 |
| `--no-onconfiguring`   |       | 禁止在生成的 `DbContext` 类中生成 `OnConfiguring` 方法。     |
| `--no-pluralize`       |       | 请勿使用复数化程序。                                         |

### 4. 配置数据库连接字符串

在 `appsettings.json` 文件中配置数据库连接字符串。

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your_connection_string_here"
  }
}
```

### 5. 配置服务

在 `Startup.cs` 文件的 `ConfigureServices` 方法中配置数据库上下文服务。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
}
```

确保在 `Startup.cs` 文件的顶部添加了 `using` 声明：

```csharp
using Microsoft.EntityFrameworkCore;
```

### 6. 使用数据库上下文

现在，你可以在控制器或其他服务中注入数据库上下文，并使用它来执行数据库操作。

```csharp
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }
}
```

### 7. 调用存储过程与原生SQL

 #### 7.1. 准备工作

在使用 EF Core 调用存储过程与原生 SQL 之前，需要做以下准备工作：

- 在新建的数据库上下文的分部类中添加相应的 DbSet，确保上下文在 CLI 自动生成模型后不会被覆盖。

```csharp
// 数据库上下文
public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }
}

// 数据库上下文分部类
public partial class MyDbContext
{
      public DbSet<MyEntity> MyEntities { get; set; }
}

```



 #### 7.2. 代码示例

```csharp
// 参数值
var param1Value = "value1";
var param2Value = "value2";

// 直接使用内插字符串
var sqlQuery = $"EXEC MyStoredProcedure '{param1Value}', '{param2Value}'";

// 使用参数化查询
var sqlQuery1 = "EXEC MyStoredProcedure @param1, @param2";
var sqlQuery2 = "EXEC MyStoredProcedure {0}, {1}";

// 示例：FromSql（EF Core 7.0 引入和 FromSqlInterpolated 使用一致）
var resultFromSql = dbContext.MyEntity.FromSql(sqlQuery).ToList();

// 示例：FromSqlRaw
var resultFromSqlRaw = dbContext.MyEntity.FromSqlRaw(sqlQuery1,
    new SqlParameter("@param1", param1Value),
    new SqlParameter("@param2", param2Value)).ToList();

var result1FromSqlRaw = dbContext.MyEntity.FromSqlRaw(sqlQuery2,
    new SqlParameter("@param1", param1Value),
    new SqlParameter("@param2", param2Value)).ToList();

// 示例：FromSqlInterpolated（自动处理参数化）
var resultFromSqlInterpolated = dbContext.MyEntity.FromSqlInterpolated(sqlQuery).ToList();

// 示例：ExecuteSql（EF Core 7.0 引入和 ExecuteSqlInterpolated 使用一致）
int resultExecuteSql = dbContext.Database.ExecuteSql(sqlQuery);

// 示例：ExecuteSqlRaw
int resultExecuteSqlRaw = dbContext.Database.ExecuteSqlRaw(sqlQuery1,
    new SqlParameter("@param1", param1Value),
    new SqlParameter("@param2", param2Value));

int result1ExecuteSqlRaw = dbContext.Database.ExecuteSqlRaw(sqlQuery2,
    new SqlParameter("@param1", param1Value),
    new SqlParameter("@param2", param2Value));

// 示例：ExecuteSqlInterpolated（自动处理参数化）
int resultExecuteSqlInterpolated = dbContext.Database.ExecuteSqlInterpolated(sqlQuery);

```



#### 7.3. 调用方法和区别

下表列出了各种调用方法的区别：

| 方法名称                   | 描述                                                         | 参数类型                      | 备注                             |
| :------------------------- | ------------------------------------------------------------ | ----------------------------- | :------------------------------- |
| **FromSql**                | 创建基于插值字符串表示的 SQL 查询的 LINQ 查询。返回`IQueryable<T>` | `FormattableString`           | 使用插值字符串，自动处理参数化   |
| **FromSqlRaw**             | 创建基于原始 SQL 查询的 LINQ 查询。返回`IQueryable<T>`       | `string` 和 `params object[]` | 接收原始 SQL 字符串和可选参数。  |
| **FromSqlInterpolated**    | 创建基于插值字符串表示的 SQL 查询的 LINQ 查询。返回`IQueryable<T>` | `FormattableString`           | 使用插值字符串，自动处理参数化。 |
| **ExecuteSql**             | 执行给定的 SQL 并返回受影响的行数。                          | `FormattableString`           | 使用插值字符串，自动处理参数化   |
| **ExecuteSqlRaw**          | 执行给定的 SQL 并返回受影响的行数。                          | `string` 和 `params object[]` | 接收原始 SQL 字符串和可选参数。  |
| **ExecuteSqlInterpolated** | 执行给定的 SQL 并返回受影响的行数。                          | `FormattableString`           | 使用插值字符串，自动处理参数化。 |

##### 详细说明

- **FromSql** 和 **FromSqlInterpolated**：EF Core 7.0 引入，两者功能和实现方式一致，都可以自动处理参数化，都用于创建基于插值字符串的 SQL 查询的 LINQ 查询。
- **FromSqlRaw**：接收原始 SQL 字符串和参数列表。
- **ExecuteSql** 和 **ExecuteSqlInterpolated**：EF Core 7.0 引入，两者功能和实现方式一致，都可以自动处理参数化，都用于执行给定的 SQL 并返回受影响的行数。
- **ExecuteSqlRaw**：接收原始 SQL 字符串和参数列表，用于执行给定的 SQL 并返回受影响的行数。
- 以上 API 方法，与任何接受 SQL 的 API 一样，重要的是将任何用户输入参数化，以防止 SQL 注入
  攻击。您可以在 SQL 查询字符串中包含参数占位符，然后提供额外的参数值
  参数。您提供的任何参数值都将自动转换为 `DbParameter`。

#### 7.4. 调用带有输出参数的存储过程

要调用带有输出参数的存储过程，可以使用 ExecuteSql 或 ExecuteSqlInterpolated 方法，并通过参数传递输出参数。

```csharp
var outputParam = new SqlParameter("@outputParam", SqlDbType.Int)
{
    Direction = ParameterDirection.Output
};

dbContext.Database.ExecuteSqlRaw("EXEC MyStoredProcedure @inputParam, @outputParam OUTPUT", 
    new SqlParameter("@inputParam", param1),
    outputParam);

int result = (int)outputParam.Value;
```


### 8. 自定义 EfCoreHelper 类，方便动态构建 Lambda 表达式进行查询，并执行分页、排序、过滤等数据库操作

#### Sort 方法

根据提供的 orderBy 字符串对 `IQueryable<T>` 集合进行排序。

##### 方法签名
```csharp
public static IQueryable<T> Sort<T>(this IQueryable<T> query, string orderBy)
```

- `query`: 要排序的 IQueryable 集合。
- `orderBy`: 以 "属性 方向" 格式表示的排序条件。

##### 示例
```csharp
var sortedQuery = dbContext.Users.Sort("Name ascending");
```

#### Filter 方法

根据提供的条件组列表对 `IQueryable<T>` 集合进行过滤。

##### 方法签名
```csharp
public static IQueryable<T> Filter<T>(this IQueryable<T> query, List<ConditionGroup>? groupedConditions)
```

- `query`: 要过滤的 IQueryable 集合。
- `groupedConditions`: 要应用的条件组列表。

##### 示例
```csharp
var filteredQuery = dbContext.Products.Filter(conditionGroups);
```

#### GetPageList 方法

从数据库中检索元素的分页列表。

##### 方法签名
```csharp
public static Page<T> GetPageList<T>(DbContext context, int pageNumber, int pageSize, string orderBy = "", List<ConditionGroup>? conditionGroups = null) where T : class
```

- `context`: 数据库上下文。
- `pageNumber`: 要检索的页码。
- `pageSize`: 每页的大小。
- `orderBy`: 排序条件。
- `conditionGroups`: 用于过滤的条件组列表。

##### 示例
```csharp
var page = EfCoreHelper.GetPageList<User>(dbContext, 1, 10, "Name ascending", conditionGroups);
```

#### GetPageListByNativeSql 方法

使用本机 SQL 查询检索元素的分页列表。

##### 方法签名
```csharp
public static Page<T> GetPageListByNativeSql<T>(DbContext context, string sql, int pageNumber, int pageSize, string orderBy = "", List<ConditionGroup>? conditionGroups = null, object[]? sqlParameters = null) where T : class
```

- `context`: 数据库上下文。
- `sql`: SQL 查询。
- `pageNumber`: 要检索的页码。
- `pageSize`: 每页的大小。
- `orderBy`: 排序条件。
- `conditionGroups`: 用于过滤的条件组列表。
- `sqlParameters`: SQL 查询的可选参数。

##### 示例
```csharp
var page = EfCoreHelper.GetPageListByNativeSql<User>(dbContext, "SELECT * FROM Users", 1, 10, "Name ascending", conditionGroups);
```

#### DeleteAll 方法

删除符合条件的所有记录。

##### 方法签名
```csharp
public static int DeleteAll<T>(DbContext context, Expression<Func<T, bool>> filter) where T : class
```

- `context`: 数据库上下文。
- `filter`: 要应用的过滤器表达式。

##### 示例
```csharp
var deletedCount = EfCoreHelper.DeleteAll<User>(dbContext, u => u.Age > 50);
```

#### UpdateRecords 方法

根据条件更新记录。

##### 方法签名
```csharp
public static int UpdateRecords<T>(DbContext context, Func<T, bool> predicate, Action<T> updateAction) where T : class
```

- `context`: 数据库上下文。
- `predicate`: 要应用的条件谓词。
- `updateAction`: 更新记录的操作。

##### 示例
```csharp
var updatedCount = EfCoreHelper.UpdateRecords<User>(dbContext, u => u.IsActive, u => u.IsActive = false);
```

#### EfCoreHelper 完整代码

```csharp
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace Loquy.Common.Helpers
{
    public static class EfCoreHelper
    {
       public class Page<T>
       {
           public List<T> pageList { get; set; }

           public int pageNumber { get; set; }

           public int pageSize { get; set; }

           public int total { get; set; }

           public Page()
           {
               pageList = new List<T>();
           }
       }
   
        public static IQueryable<T> Sort<T>(this IQueryable<T> query, string orderBy)
        {
            if (string.IsNullOrEmpty(orderBy))
            {
                return query;
            }
            string[] orderByParts = orderBy.Split(' ');
            if (orderByParts.Length == 2)
            {
                string column = orderByParts[0].Trim();
                string sort = orderByParts[1].Trim().ToLower();

                // 校验排序方式是否为 "ascending" 或 "descending"
                if (sort == "ascending" || sort == "descending")
                {
                    // 检查实体是否具有提供的列名属性
                    var entityType = typeof(T);
                    var property = entityType.GetProperty(column);
                    if (property != null)
                    {
                        query = sort == "ascending" ? query.OrderBy(t => EF.Property<object>(t!, column))
                            : query.OrderByDescending(t => EF.Property<object>(t!, column));
                    }
                }
            }
            return query;
        }

        public class Condition
        {
            public string PropertyName { get; set; }
            public Comparison Comparison { get; set; }
            public object? Value { get; set; }
            public object? MinValue { get; set; }
            public object? MaxValue { get; set; }
        }

        public class ConditionGroup
        {
            public List<Condition> Conditions { get; set; }
            public LogicOperator Logic { get; set; }
        }

        public enum LogicOperator
        {
            AND,
            OR
        }

        public enum Comparison
        {
            Equal = 1,
            GreaterThan = 2,
            GreaterThanOrEqual = 3,
            LessThan = 4,
            LessThanOrEqual = 5,
            Contains = 6,
            StartWith = 7,
            EndWith = 8,
            Between = 9
        }

        public static IQueryable<T> Filter<T>(this IQueryable<T> query, List<ConditionGroup>? groupedConditions)
        {
            var parameter = Expression.Parameter(typeof(T), "t");
            List<Expression> groupExpressions = new List<Expression>(); // 用于存储所有分组的表达式

            if (groupedConditions == null)
            {
                return query;
            }

            foreach (var group in groupedConditions)
            {
                List<Condition> conditions = group.Conditions;
                LogicOperator groupLogic = group.Logic;

                List<Expression> conditionExpressions = new List<Expression>(); // 用于存储每个分组内的条件表达式

                foreach (Condition condition in conditions)
                {
                    Type type = typeof(T);
                    PropertyInfo? propertyInfo = type.GetProperty(condition.PropertyName);
                    if (propertyInfo == null ||
                        condition.Comparison != Comparison.Between && condition.Value == null ||
                        condition.Comparison == Comparison.Between && (condition.MinValue == null || condition.MaxValue == null) ||
                        condition.Value is string strValue && string.IsNullOrEmpty(strValue))
                    {
                        continue;
                    }

                    Expression property = Expression.Property(parameter, propertyInfo);

                    Expression valueExpression = ConvertToPropertyType(condition.Value, propertyInfo.PropertyType);

                    Expression comparisonExpression;

                    switch (condition.Comparison)
                    {
                        case Comparison.Equal:
                            comparisonExpression = Expression.Equal(property, valueExpression);
                            break;
                        case Comparison.GreaterThan:
                            comparisonExpression = Expression.GreaterThan(property, valueExpression);
                            break;
                        case Comparison.GreaterThanOrEqual:
                            comparisonExpression = Expression.GreaterThanOrEqual(property, valueExpression);
                            break;
                        case Comparison.LessThan:
                            comparisonExpression = Expression.LessThan(property, valueExpression);
                            break;
                        case Comparison.LessThanOrEqual:
                            comparisonExpression = Expression.LessThanOrEqual(property, valueExpression);
                            break;
                        case Comparison.Contains:
                            comparisonExpression = Expression.Call(property, typeof(string).GetMethod("Contains", new[] { typeof(string) })!, valueExpression);
                            break;
                        case Comparison.StartWith:
                            comparisonExpression = Expression.Call(property, typeof(string).GetMethod("StartsWith", new[] { typeof(string) })!, valueExpression);
                            break;
                        case Comparison.EndWith:
                            comparisonExpression = Expression.Call(property, typeof(string).GetMethod("EndsWith", new[] { typeof(string) })!, valueExpression);
                            break;
                        case Comparison.Between:
                            Expression minValueExpression = ConvertToPropertyType(condition.MinValue, propertyInfo.PropertyType);
                            Expression maxValueExpression = ConvertToPropertyType(condition.MaxValue, propertyInfo.PropertyType);

                            var min = Expression.GreaterThanOrEqual(property, minValueExpression);
                            var max = Expression.LessThanOrEqual(property, maxValueExpression);

                            comparisonExpression = Expression.And(min, max);
                            break;
                        default:
                            throw new ArgumentException("无效的比较运算符。");
                    }

                    conditionExpressions.Add(comparisonExpression);
                }

                // 根据分组的逻辑操作，将条件合并为总的表达式
                Expression? groupCombinedExpression = null;
                if (conditionExpressions.Any())
                {
                    groupCombinedExpression = conditionExpressions.Aggregate(groupLogic == LogicOperator.AND ? Expression.And : Expression.Or);
                }
                if (groupCombinedExpression != null)
                {
                    groupExpressions.Add(groupCombinedExpression);
                }
            }

            // 使用 AND 逻辑操作，合并所有分组表达式
            Expression? combinedExpression = null;
            if (groupExpressions.Any())
            {
                combinedExpression = groupExpressions.Aggregate(Expression.And);
            }

            // 如果没有任何条件，则返回原始查询
            if (combinedExpression == null)
            {
                return query;
            }
            // 构建 Lambda 表达式，并将其应用到查询上
            var lambdaExpression = Expression.Lambda<Func<T, bool>>(combinedExpression, parameter);
            var expressionString = lambdaExpression.ToString();

            return query.Where(lambdaExpression);
        }

        public static Expression ConvertToPropertyType<T>(T value, Type propertyType)
        {
            return Expression.Constant(value, propertyType);
        }


        public static Page<T> GetPageList<T>(DbContext context, int pageNumber, int pageSize, string orderBy = "", List<ConditionGroup>? conditionGroups = null) where T : class
        {
            var query = context.Set<T>().AsQueryable().Filter(conditionGroups).Sort(orderBy);
            var totalCount = query.Count();
            var pageList = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            return new Page<T>
            {
                pageList = pageList,
                pageNumber = pageNumber,
                pageSize = pageSize,
                total = totalCount
            };
        }

        public static Page<T> GetPageListByNativeSql<T>(DbContext context, string sql, int pageNumber, int pageSize, string orderBy = "", List<ConditionGroup>? conditionGroups = null, object[]? sqlParameters = null) where T : class
        {
            IQueryable<T> query;

            if (sqlParameters != null)
            {
                query = context.Set<T>().FromSqlRaw(sql, sqlParameters);
            }
            else
            {
                query = context.Set<T>().FromSqlRaw(sql);
            }

            query = query.Filter(conditionGroups).Sort(orderBy);

            var totalCount = query.Count();
            var pageList = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            return new Page<T>
            {
                pageList = pageList,
                pageNumber = pageNumber,
                pageSize = pageSize,
                total = totalCount
            };
        }

        public static int DeleteAll<T>(DbContext context, Expression<Func<T, bool>> filter) where T : class
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                var recordsToDelete = context.Set<T>().Where(filter).ToList();

                if (recordsToDelete.Any())
                {
                    context.Set<T>().RemoveRange(recordsToDelete);
                    int affectedRows = context.SaveChanges();

                    if (affectedRows != recordsToDelete.Count)
                    {
                        transaction.Rollback();
                        throw new Exception($"部分数据删除失败，总共 {recordsToDelete.Count} 条，删除 {affectedRows} 条记录，进行回滚");
                    }

                    transaction.Commit();

                    return affectedRows;
                }
                else
                {
                    transaction.Rollback();
                    throw new Exception($"数据库查询不到符合条件的记录");
                }
            }
        }

        public static int UpdateRecords<T>(DbContext context, Func<T, bool> predicate, Action<T> updateAction) where T : class
        {
            int affectedRows = 0;

            using (var transaction = context.Database.BeginTransaction())
            {
                var recordsToUpdate = context.Set<T>().Where(predicate).ToList();

                if (recordsToUpdate.Any())
                {
                    foreach (var record in recordsToUpdate)
                    {
                        updateAction(record);
                    }

                    affectedRows = context.SaveChanges();

                    if (affectedRows > 0)
                    {
                        transaction.Commit();
                    }
                    else
                    {
                        transaction.Rollback();
                        throw new Exception("更新操作未能影响任何记录");
                    }
                }
                else
                {
                    throw new Exception("数据库查询不到符合条件的记录");
                }
            }
            return affectedRows;
        }
    }
}

```



## 十、使用 AutoMapper 进行对象映射

AutoMapper 是一个自动执行对象到对象之间的映射的工具，用于简化在不同层之间的对象转换。在 ASP.NET Core 中，AutoMapper Profile 是用于配置和定义映射规则的类。通过继承 `Profile` 类，你可以集中管理所有映射配置，保持代码清晰和易维护。

### 1. 安装 AutoMapper

要在 ASP.NET Core 项目中使用 AutoMapper，你需要安装两个 NuGet 包：`AutoMapper` 和 `AutoMapper.Extensions.Microsoft.DependencyInjection`。

**使用 NuGet 包管理器控制台：**

```bash
Install-Package AutoMapper
```

**使用 .NET CLI：**

```bash
dotnet add package AutoMapper
```

### 2. 配置 AutoMapper Profile

创建一个继承自 `Profile` 的类，在其中定义对象之间的映射规则。

**示例：DtoMapper.cs**

```csharp
using AutoMapper;
using Loquy.Dtos;
using Loquy.Models;

namespace Loquy.Services.Mapper
{
    public class DtoMapper : Profile
    {
        public DtoMapper()
        {
            CreateMap<User, UserDto>();
        }
    }
}
```

在这个示例中，`DtoMapper` 类定义了从 `User` 到 `UserDto` 的映射规则。

### 3. 创建自定义扩展方法注册 AutoMapper

为了简化 AutoMapper 的注册过程，可以创建自定义扩展方法。

**示例：ServiceCollectionExtensions.cs**

```csharp
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace Loquy.Services.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomAutoMapper(this IServiceCollection services)
        {
            var mapperConfiguration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<DtoMapper>();
            });

            IMapper mapper = mapperConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            return services;
        }
    }
}
```

在这个示例中，`AddCustomAutoMapper` 方法配置了 AutoMapper，并将其注册为单例服务。

### 4. 在 Startup.cs 中注册 AutoMapper

在 `Startup.cs` 文件的 `ConfigureServices` 方法中调用我们定义的扩展方法来注册 AutoMapper。

**示例：Startup.cs**

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // 注册 Services
    services.AddDependencyGroup();
    // 注册 AutoMapper
    services.AddCustomAutoMapper();

    // 其他服务注册
}
```

通过这样的方法，我们可以将 AutoMapper 的配置和注册逻辑分离到独立的扩展方法中，使得 `Startup.cs` 文件更加简洁。

### 5. 使用 AutoMapper

现在你可以在你的控制器或服务中使用 AutoMapper 进行对象映射。你只需要通过构造函数注入 `IMapper` 接口，并使用 `Map` 方法进行对象转换。

**示例：UsersController.cs**

```csharp
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

public class UsersController : ControllerBase
{
    private readonly IMapper _mapper;

    public UsersController(IMapper mapper)
    {
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public ActionResult<UserDto> GetUser(int id)
    {
        // 模拟从数据库获取用户
        User user = GetUserById(id);

        // 使用 AutoMapper 将 User 转换为 UserDto
        UserDto userDto = _mapper.Map<UserDto>(user);

        return Ok(userDto);
    }

    private User GetUserById(int id)
    {
        // 模拟数据获取
        return new User { Id = id, FirstName = "John", LastName = "Doe" };
    }
}
```

在这个示例中，通过构造函数注入 `IMapper` 实例，并使用 `_mapper.Map<UserDto>(user)` 将 `User` 对象转换为 `UserDto` 对象。



## 十一、使用 JWTBearer 进行身份验证

1. **安装所需的包**：首先，你需要安装必要的 NuGet 包。

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

2. **配置 JWTBearer 身份验证**：在 `Startup.cs` 文件的 `ConfigureServices` 方法中配置 JWTBearer 身份验证，并读取 `appsettings.json` 提供的配置。

```json
{
  "JwtSettings": {
    "SecretKey": "YourSecretKeyHere",
    "Issuer": "YourIssuerHere",
    "Audience": "YourAudienceHere",
    "ExpirationMinutes": 30 // 令牌过期时间，单位为分钟
  }
}
```

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

public class Startup
{
    public IConfiguration Configuration { get; }

    // 构造函数，接收 IConfiguration 对象用于读取配置
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    // 配置服务
    public void ConfigureServices(IServiceCollection services)
    {
        // 从配置中读取 JWT 相关设置
        var jwtSettings = Configuration.GetSection("JwtSettings");

        // 从配置中获取密钥、发布者、订阅者和令牌过期时间
        var secretKey = jwtSettings["SecretKey"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expirationMinutes = Convert.ToInt32(jwtSettings["ExpirationMinutes"]);

        // 添加身份验证服务
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // 设置令牌验证参数
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, // 验证发布者
                    ValidateAudience = true, // 验证订阅者
                    ValidateLifetime = true, // 验证令牌生命周期
                    ValidateIssuerSigningKey = true, // 验证签名密钥
                    ValidIssuer = issuer, // 设置有效的发布者
                    ValidAudience = audience, // 设置有效的订阅者
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)), // 设置签名密钥
                    ClockSkew = TimeSpan.Zero // 不允许任何时钟偏差
                };
            });

        // 添加控制器服务
        services.AddControllers();
    }

    // 配置应用程序请求管道
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // 省略其他配置...

        // 使用身份验证中间件
        app.UseAuthentication();
        app.UseAuthorization();

        // 配置端点路由
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
```

3. **保护你的 API 端点**：在需要保护的 API 控制器或方法上使用 `[Authorize]` 特性。

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class YourController : ControllerBase
{
    // 你的受保护 API 端点
}
```

4. **生成和验证 JWT 令牌**：当需要生成 JWT 令牌时，你可以使用 `System.IdentityModel.Tokens.Jwt` 或其他相关库。你可以使用提供的配置中的过期时间来设置令牌的有效期。

```csharp
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly IConfiguration _configuration;

    // 构造函数，接收 IConfiguration 对象用于读取配置
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // 生成 JWT 令牌
    public string GenerateToken()
    {
        // 从配置中获取 JWT 相关设置
        var jwtSettings = _configuration.GetSection("JwtSettings");

        // 创建 JWT 令牌处理器
        var tokenHandler = new JwtSecurityTokenHandler();
        // 从配置中获取密钥，并转换为字节数组
        var secretKey = jwtSettings["SecretKey"];
        var key = Encoding.ASCII.GetBytes(secretKey);
        // 获取发布者和订阅者信息
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        // 获取令牌过期时间（分钟）
        var expirationMinutes = Convert.ToInt32(jwtSettings["ExpirationMinutes"]);

        // 构建令牌描述信息
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            // 设置主题，这里可以添加用户声明等信息
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, "username"),
                // 添加其他声明
            }),
            // 设置令牌过期时间
            Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
            // 设置令牌的订阅者信息
            Audience = audience,
            // 设置令牌的发布者信息
            Issuer = issuer,
            // 设置签名凭据，使用对称密钥进行签名
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        // 创建 JWT 令牌
        var token = tokenHandler.CreateToken(tokenDescriptor);
        // 将令牌序列化为字符串并返回
        return tokenHandler.WriteToken(token);
    }

    // 从令牌中解析出用户主体
    public ClaimsPrincipal GetPrincipalFromToken(string token)
    {
        // 创建 JWT 令牌处理器
        var tokenHandler = new JwtSecurityTokenHandler();
        // 从配置中获取 JWT 相关设置
        var jwtSettings = _configuration.GetSection("JwtSettings");
        // 从配置中获取密钥，并转换为字节数组
        var secretKey = jwtSettings["SecretKey"];
        var key = Encoding.ASCII.GetBytes(secretKey);

        try
        {
            // 设置令牌验证参数
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true, // 验证签名密钥
                IssuerSigningKey = new SymmetricSecurityKey(key), // 设置签名密钥
                ValidateIssuer = true, // 验证发布者信息
                ValidIssuer = jwtSettings["Issuer"], // 设置有效的发布者
                ValidateAudience = true, // 验证订阅者信息
                ValidAudience = jwtSettings["Audience"], // 设置有效的订阅者
                ValidateLifetime = true, // 验证令牌的生命周期
                ClockSkew = TimeSpan.Zero // 不允许任何时钟偏差
            };

            // 验证令牌并获取用户主体信息
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
            // 返回用户主体信息
            return principal;
        }
        catch
        {
            // 令牌无效，返回 null
            return null;
        }
    }
}
```