(() => {
 const surface=document.querySelector('#rotate-surface');if(!surface)return;
 const is360=document.body.dataset.viewMode==='360';
 const reset=document.querySelector('#reset-angle'),fold=document.querySelector('#fold'),panel=document.querySelector('.panel');
 const slider=document.querySelector('#zoom-range'),output=document.querySelector('#zoom-value');
 const T=AFRAME.THREE,points=new Map();let target=null,zoom=1,yaw=0,pinch=null;
 const rotation=new T.Quaternion(),axisX=new T.Vector3(1,0,0),axisY=new T.Vector3(0,1,0);
 const minimum=.4,maximum=3;
 function apply(){if(target){if(is360)target.object3D.quaternion.copy(rotation);else target.setAttribute('rotation',{x:0,y:yaw,z:0});target.setAttribute('scale',{x:zoom,y:zoom,z:zoom});}if(slider)slider.value=String(zoom);if(output)output.textContent=Math.round(zoom*100)+'%';}
 function setZoom(value){zoom=Math.max(minimum,Math.min(maximum,value));apply();}
 function rotate(dx,dy){if(is360){rotation.premultiply(new T.Quaternion().setFromAxisAngle(axisY,dx*.009));rotation.premultiply(new T.Quaternion().setFromAxisAngle(axisX,dy*.009));rotation.normalize();}else yaw=(yaw+dx*.6)%360;apply();}
 function rebasePinch(){if(points.size===2){const [a,b]=[...points.values()];pinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom};}else pinch=null;}
 function drop(id){if(!points.has(id))return;points.delete(id);if(surface.hasPointerCapture(id))surface.releasePointerCapture(id);rebasePinch();if(!points.size)surface.classList.remove('dragging');}
 function clear(){for(const id of [...points.keys()])drop(id);pinch=null;}
 surface.addEventListener('pointerdown',e=>{if(surface.hidden||!target||(e.pointerType==='mouse'&&e.button!==0))return;if(points.size>=2)return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});surface.setPointerCapture(e.pointerId);surface.classList.add('dragging');rebasePinch();});
 surface.addEventListener('pointermove',e=>{const previous=points.get(e.pointerId);if(!previous)return;const dx=e.clientX-previous.x,dy=e.clientY-previous.y;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2&&pinch){const [a,b]=[...points.values()];setZoom(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance);}else rotate(dx,dy);});
 ['pointerup','pointercancel','lostpointercapture'].forEach(name=>surface.addEventListener(name,e=>drop(e.pointerId)));
 surface.addEventListener('wheel',e=>{if(surface.hidden||!target)return;e.preventDefault();setZoom(zoom*Math.exp(-Math.max(-200,Math.min(200,e.deltaY))*.002));},{passive:false});
 surface.addEventListener('keydown',e=>{if(!target)return;const keys={ArrowLeft:[-35,0],ArrowRight:[35,0],ArrowUp:[0,-35],ArrowDown:[0,35]};if(keys[e.key]){e.preventDefault();rotate(...keys[e.key]);}else if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(zoom*1.2);}else if(e.key==='-'){e.preventDefault();setZoom(zoom/1.2);}});
 document.querySelector('#zoom-in')?.addEventListener('click',()=>setZoom(zoom*1.2));document.querySelector('#zoom-out')?.addEventListener('click',()=>setZoom(zoom/1.2));slider?.addEventListener('input',()=>setZoom(Number(slider.value)));
 function home(){clear();rotation.identity();zoom=1;yaw=0;apply();}reset?.addEventListener('click',home);
 document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{clear();const mode=button.dataset.view;rotation.identity();if(mode==='back')rotation.setFromAxisAngle(axisY,Math.PI);if(mode==='top')rotation.setFromAxisAngle(axisX,Math.PI/2);if(mode==='bottom')rotation.setFromAxisAngle(axisX,-Math.PI/2);apply();}));
 fold?.addEventListener('click',()=>{const closed=panel.classList.toggle('collapsed');fold.textContent=closed?'Mở rộng':'Thu gọn';fold.setAttribute('aria-expanded',String(!closed));});
 document.addEventListener('ar-tracking',e=>{home();target=e.detail.found?document.querySelector('#animal-model-'+e.detail.id):null;surface.hidden=!target;home();});
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});apply();
})();