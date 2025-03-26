import { Component, OnInit, OnDestroy } from '@angular/core';
import { MotionService } from './Services/motion.service';
import { MotionData } from './Model/MotionData.model';

@Component({
  selector: 'app-motion',
  templateUrl: './motion.component.html',
  styleUrls: ['./motion.component.scss']
})
export class MotionComponent implements OnInit, OnDestroy {
  motionData: MotionData = {};
  stepCount: number = 0;
  previousAcceleration: number = 0;

  constructor(private motionS: MotionService) {}

  ngOnInit(): void {
    this.motionS.startMotionDetection((data: MotionData) => {
      this.motionData = data;
      this.detectStep(this.motionData.acceleration);
      console.log('Motion Data:', this.motionData);
    });
  }

  detectStep(acceleration: { x: number; y: number; z: number } | undefined) {
    if (acceleration) {
      const currentAcceleration = Math.sqrt(
        acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
      );
      const accelerationDifference = Math.abs(currentAcceleration - this.previousAcceleration);

      if (accelerationDifference > 1.5) { // Threshold for step detection
        this.stepCount++;
      }

      this.previousAcceleration = currentAcceleration;
    }
  }

  ngOnDestroy(): void {
    this.motionS.stopMotionDetection();
  }
}
