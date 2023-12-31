import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root'
})
export class HandleHttpErrorService {
  constructor(private modalService: NgbModal) { }
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == "400") {
        this.mostrarError400(error);
      }
      return of(result as T);
    };
  }
  public log(message: string) {
    const messageBox = this.modalService.open(AlertModalComponent)
    messageBox.componentInstance.title = 'Resultado Operación';
    messageBox.componentInstance.message = message;
  }
  private mostrarError400(error: any): void {
    console.error(error);
    let contadorValidaciones: number = 0;
    let mensajeValidaciones: string =
      `Se ha presentado un error de validación: <br/><br/>`;
    for (const prop in error.error.errors) {
      contadorValidaciones++;
      mensajeValidaciones += `<strong>${contadorValidaciones}. ${prop}:</strong>`;
      error.error.errors[prop].forEach(element => {
        mensajeValidaciones += `<br/> - ${element}`;
      });
      mensajeValidaciones += `<br/>`;
    }
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = 'Mensaje de Error';
    modalRef.componentInstance.message = mensajeValidaciones;
  }
}