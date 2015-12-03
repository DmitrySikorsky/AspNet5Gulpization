// Copyright © 2015 Dmitry Sikorsky. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace AspNet5Gulpization
{
  public class Startup
  {
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc();
    }

    public void Configure(IApplicationBuilder applicationBuilder)
    {
      // Next line is required to be able to use static files (like .css and .js ones)
      applicationBuilder.UseStaticFiles();
      applicationBuilder.UseMvcWithDefaultRoute();
    }
  }
}