import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

constructor() { }

//SIGNAL PARA CONTROLAR EL ESTADO DEL SPINNER
private loadingSignal = signal<boolean>(false);
public loading = computed(() => this.loadingSignal())

// SIGNAL PARA CONTROLAR EL CIERRE Y APERTURA DEL SIDENAV
private sidenavClSignal = signal<boolean>(true);
public sidenavCl = computed(() => this.sidenavClSignal());

// SIDENAV QUE CONTROLA EL TAMAÑO DEL SIDENAV
private sizeNav = signal<boolean>(true);
public sizeNavcl = computed(() => this.sizeNav());

// SIGNAL QUE CONTROLA EL ELEMENTO HOVER DEL SIDENAV
private sidenavHovered = signal(false)

// FUNCIONES PARA CONTROLAR EL ESTADO DEL SPINNER
onLoading(value: boolean){
  this.loadingSignal.set(value);
}

// FUNCIONES PARA CONTROLAR EL ESTADO DEL SIDENAV
toggleSidenav() {
  this.sizeNav.update(currentState => !currentState); // Alterna el estado de apertura
}

// FUNCIONES PARA CONTROLAR EL ESTADO DEL SIDENAV
toggleSidenavHover(value: boolean) {
  this.sidenavHovered.set(value);
}

// FUNCION PARA RETORNAR EL ESTADO DE SIDENAVHOVERED
isSidenavHovered() {
  return this.sidenavHovered();
}

}
