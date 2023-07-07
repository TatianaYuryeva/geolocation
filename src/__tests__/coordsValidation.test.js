import { Widget } from "../js/widget";

test("validate geolocation coordinates", () => {
  expect(Widget.coordsValidation("51.50851, −0.12572")).toEqual({
    lat: "51.50851",
    long: "−0.12572",
  });
  expect(Widget.coordsValidation("51.50851,−0.12572")).toEqual({
    lat: "51.50851",
    long: "−0.12572",
  });
  expect(Widget.coordsValidation("[51.50851, −0.12572]")).toEqual({
    lat: "51.50851",
    long: "−0.12572",
  });
  expect(Widget.coordsValidation("[51.50851−0.12572]")).toBe(undefined);
});
