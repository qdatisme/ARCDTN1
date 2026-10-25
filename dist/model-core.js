AFRAME.registerComponent('fit-animal', {
  schema: {size: {default: 1.65}, pivot: {default: 'ground'}},
  init: function () {
    this.onLoad = () => {
      const mesh = this.el.getObject3D('mesh');
      if (!mesh) return;
      const parent = mesh.parent;
      parent.remove(mesh);
      mesh.updateMatrixWorld(true);
      const box = new AFRAME.THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new AFRAME.THREE.Vector3());
      const center = box.getCenter(new AFRAME.THREE.Vector3());
      const factor = this.data.size / Math.max(size.x, size.y, size.z, 0.0001);
      mesh.scale.multiplyScalar(factor);
      mesh.position.multiplyScalar(factor).sub(new AFRAME.THREE.Vector3(center.x, this.data.pivot === 'center' ? center.y : box.min.y, center.z).multiplyScalar(factor));
      parent.add(mesh);
      mesh.updateMatrixWorld(true);
      this.el.dataset.ready = 'true';
      this.el.emit('animal-ready', {id: Number(this.el.dataset.animalId)});
    };
    this.el.addEventListener('model-loaded', this.onLoad);
  },
  remove: function () { this.el.removeEventListener('model-loaded', this.onLoad); }
});