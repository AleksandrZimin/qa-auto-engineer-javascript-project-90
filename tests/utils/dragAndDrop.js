export async function dragAndDrop(page, source, target) {
  const sourceBound = await source.boundingBox();
  const targetBound = await target.boundingBox();

  await page.mouse.move(
    sourceBound.x + sourceBound.width / 2,
    sourceBound.y + sourceBound.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBound.x + targetBound.width / 2,
    targetBound.y + targetBound.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
}