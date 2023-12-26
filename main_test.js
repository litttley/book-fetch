// import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

Deno.test("kv", async () => {
  const kv = await Deno.openKv();
  console.log(kv);
});

// Deno.test("12", async () => {
//   let s = await new Command()
//     .name("cliffy")
//     .version("0.1.0")
//     .description("Command line framework for Deno")
//     .parse(Deno.args);
//   console.log(s);
// });
