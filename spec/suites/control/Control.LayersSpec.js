describe("Control.Layers", function () {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});

	describe("baselayerchange event", function () {
		it("is fired on input that changes the base layer", function () {
			var baseLayers = {"Layer 1": L.tileLayer(), "Layer 2": L.tileLayer()},
				layers = L.control.layers(baseLayers).addTo(map),
				spy = sinon.spy();

			map.on('baselayerchange', spy)
				.whenReady(function () {
					happen.click(layers._baseLayersList.getElementsByTagName("input")[0]);

					expect(spy.called).to.be.ok();
					expect(spy.mostRecentCall.args[0].layer).to.be(baseLayers["Layer 1"]);
				});
		});

		it("is not fired on input that doesn't change the base layer", function () {
			var overlays = {"Marker 1": L.marker([0, 0]), "Marker 2": L.marker([0, 0])},
				layers = L.control.layers({}, overlays).addTo(map),
				spy = sinon.spy();

			map.on('baselayerchange', spy);
			happen.click(layers._overlaysList.getElementsByTagName("input")[0]);

			expect(spy.called).to.not.be.ok();
		});
	});

	describe("updates", function () {
		beforeEach(function () {
			map.setView([0, 0], 14);
		});

		it("when an included layer is addded or removed", function () {
			var baseLayer = L.tileLayer(),
				overlay = L.marker([0, 0]),
				layers = L.control.layers({"Base": baseLayer}, {"Overlay": overlay}).addTo(map);

			var spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.be.ok();
			expect(spy.callCount).to.eql(2);
		});

		it("not when a non-included layer is added or removed", function () {
			var baseLayer = L.tileLayer(),
				overlay = L.marker([0, 0]),
				layers = L.control.layers({"Base": baseLayer}).addTo(map);

			var spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.not.be.ok();
		});
	});
});
