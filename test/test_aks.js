import * as Aks from "../aks.js";
// Deno.test("downLoaddezoomify", async () => {
//    await Aks.downLoaddezoomify()

//   });
Deno.test("downLoaddezoomify", async () => {
  try {
    const src = await Deno.open("dezoomify-rs-linux.tgz", { read: true });
    const dest = await Deno.open("./dezoomify-rs-linux", {
      create: true,
      write: true,
    });
    await src.readable
      .pipeThrough(new DecompressionStream("gzip"))
      .pipeTo(dest.writable);
    //   src.close()
    //   dest.close()
  } catch (error) {
    console.log(error);
  }
});
