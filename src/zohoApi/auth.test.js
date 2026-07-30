test("registers PageLoad before init and resizes after receiving page data", async () => {
  const order = [];
  let handlePageLoad;

  window.ZOHO = {
    embeddedApp: {
      on: jest.fn((event, handler) => {
        order.push(event);
        handlePageLoad = handler;
      }),
      init: jest.fn(async () => {
        order.push("init");
        await handlePageLoad({ Entity: "Deals", EntityId: "1" });
      }),
    },
    CRM: {
      UI: {
        Resize: jest.fn(async () => {
          order.push("resize");
        }),
      },
    },
  };

  const { initZoho } = require("./auth");

  await initZoho(
    () => order.push("page data"),
    { height: "100%", width: "90%" }
  );

  expect(order).toEqual(["PageLoad", "init", "page data", "resize"]);
  expect(window.ZOHO.CRM.UI.Resize).toHaveBeenCalledWith({
    height: "100%",
    width: "90%",
  });
});
