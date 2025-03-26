import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { MotionData } from '../Model/MotionData.model';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private accelListener?: PluginListenerHandle;
  private gyroListener?: PluginListenerHandle;

  constructor() { }

  // Inicia la detección de movimiento
  async startMotionDetection(callback: (data: MotionData) => void) {
    const motionData: MotionData = {
      acceleration: { x: 0, y: 0, z: 0 },
      rotation: { alpha: 0, beta: 0, gamma: 0 }
    };

    // Verifica si el dispositivo tiene los sensores disponibles
    if (!Motion) {
      console.error('El dispositivo no soporta los sensores de movimiento.');
      return;
    }

    // Listener para el acelerómetro
    this.accelListener = await Motion.addListener('accel', (event) => {
      if (event.acceleration) {
        motionData.acceleration = event.acceleration;
        callback(motionData);  // Actualiza solo los datos de aceleración
      }
    });

    // Listener para el giroscopio
    this.gyroListener = await Motion.addListener('orientation', (event) => {
      if (event.alpha !== undefined && event.beta !== undefined && event.gamma !== undefined) {
        motionData.rotation = {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        };
        callback(motionData);  // Actualiza solo los datos de rotación
      }
    });
  }

  // Detiene la detección de movimiento
  async stopMotionDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
    if (this.gyroListener) {
      await this.gyroListener.remove();
    }
  }
}
