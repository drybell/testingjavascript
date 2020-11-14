// function CCDIK2(arm, target){
// 	console.log("START");
// 	let tcp = new Vector3();
// 	for (let i = arm.num_links() - 1; i >= 0; i--){
// 		console.log(i);
// 		// arm.robot[i].updateMatrixWorld();
// 		let curr_axis = arm.getAxis(i);
//         arm.robot[arm.num_links()].getWorldPosition(arm.tcp);
//         let toolDirection = arm.robot[i].worldToLocal(arm.tcp.clone()).normalize();
//         let targetDirection = arm.robot[i].worldToLocal(target.clone()).normalize();
//         let fromToQuat = new Quaternion(0, 0, 0, 1).setFromUnitVectors(toolDirection, targetDirection);
//         console.log(fromToQuat);
//         arm.robot[i].quaternion.multiply(fromToQuat);

//         let invRot = arm.robot[i].quaternion.clone().inverse();
//         let parentAxis = arm.robot[i].axis.clone().applyQuaternion(invRot);
//         fromToQuat.setFromUnitVectors(arm.robot[i].axis, parentAxis);
//         arm.robot[i].quaternion.multiply(fromToQuat);

//         let clampedRot = arm.robot[i].rotation.toVector3().clampScalar(curr_axis[0], curr_axis[1]);
//         arm.robot[i].rotation.setFromVector3(clampedRot);

//         arm.robot[i].updateMatrixWorld();
//         console.log(arm.robot);
// 	}
// 	return arm;
// }

// CLASS MEMBER CCDIKITER
// let curr = this.getNode(i);
// let ee   = this.getEndEffector();

// let vec_to_ee     = ee.clone().sub(curr);
// let vec_to_target = target.clone().sub(curr); 

// let quat_rot      = findQuatForVecs(vec_to_ee, vec_to_target);
// let quat_inv      = quat_rot.clone().inverse();
// let curr_axis     = this.getAxis(i);

// let parent_axis   = rotatePByQuat(curr_axis, quat_inv);
// let quat_axis     = findQuatForVecs(curr_axis, parent_axis);
// let new_quat      = quat_rot.clone().multiply(quat_axis);

// let new_q = this.constrainQuat(new_quat, i);
// if (!new_q.equals(new Quaternion(0,0,0,0))){
// 	this.rotateJByQuat(i, new_q);
// }

// CCDIKIter2(target){
// 	for (let i = this.num_links() - 1; i >= 0; i--){
// 		let curr = this.getNode(i);
// 		let ee   = this.getEndEffector();

// 		let vec_to_ee     = ee.clone().subVectors(ee, curr).normalize();
// 		let vec_to_target = target.clone().subVectors(target, curr).normalize(); 

// 		let quat_rot      = new Quaternion(0, 0, 0, 1).setFromUnitVectors(vec_to_ee, vec_to_target);
// 		let quat_inv      = quat_rot.clone().inverse();
// 		let curr_axis     = this.getAxis(i);
// 		let angles = this.getAngleLims(i);

// 		let parent_axis   = curr_axis.applyQuaternion(quat_inv);
// 		let quat_axis     = new Quaternion(0, 0, 0, 1).setFromUnitVectors(curr_axis, parent_axis);
// 		let new_quat      = quat_rot.clone().multiply(quat_axis).normalize();
// 		// this.robot[i].setRotationFromQuaternion(new_quat);

// 		// let clampedRot = this.robot[i].rotation.toVector3().clampScalar(radians(angles[0]), radians(angles[1]));
//   //       this.robot[i].rotation.setFromVector3(clampedRot);
// 		// let new_q = this.constrainQuat(new_quat, i);
// 		// console.log(new_q);
// 		// if (!new_q.equals(new Quaternion(0,0,0,0))){
// 			// this.rotateJByQuat(i, new_q);
// 			// this.robot[i].setRotationFromQuaternion(new_q);
// 			// this.robot[i].updateMatrixWorld();
// 		// }

// 		this.rotateJByQuat(i, quat_rot);
// 		this.robot[i].setRotationFromQuaternion(quat_rot);
// 		this.robot[i].updateMatrixWorld();
// 	}
// }