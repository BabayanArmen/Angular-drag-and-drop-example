import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { first, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-widgets-dashboard',
  templateUrl: './widgets-dashboard.component.html',
  styleUrls: ['./widgets-dashboard.component.scss']
})
export class WidgetsDashboardComponent implements OnInit {
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  @ViewChild('context') contextMenu!: ElementRef;
  // @ViewChild('newWidget') newWidgetEl!: ElementRef;
  // newWidgetSub!: Subscription;

  cellId!:number;

  constructor(private renderer: Renderer2) { }

  @HostListener('document:click', ['$event'])
  documentClick() {
    this.contextMenu.nativeElement.style.display = "none"
    // if(this.newWidgetSub) this.newWidgetSub.unsubscribe()
  }

  ngOnInit(): void { }

  onAddCell() {
    let id = "cell-id-" + Math.round(Math.random() * 1000000 );
    let cell = this.renderer.createElement('div')
    this.renderer.setAttribute(cell, 'id', id)
    cell.className = "cell"
    this.renderer.listen(cell, 'contextmenu', (event: any) => {
      this.openContextMenu(event)
    })

    // drag and drop ////
    // this.renderer.setAttribute(cell, 'draggable', 'true');
    // this.renderer.listen(cell, 'dragstart', (event) => {
    //   this.drag(event);
    // })
    this.renderer.listen(cell, 'drop', (event) => {
      this.drop(event);
    })
    this.renderer.listen(cell, 'dragover', (event) => {
      this.allowDrop(event);
    })
    document.getElementById('root')?.appendChild(cell)
  }

  
  openContextMenu(ev: any) {
    ev.preventDefault();
    this.contextMenuX = ev.clientX;
    this.contextMenuY = ev.clientY;
    let displayValue = this.contextMenu.nativeElement.style.display;
    if(displayValue === "block") {
      // this.newWidgetSub.unsubscribe()
      this.contextMenu.nativeElement.style.display = "none"
    }else {
      this.contextMenu.nativeElement.style.display = "block"
      // this.newWidgetSub = fromEvent(this.newWidgetEl.nativeElement, 'click')
      // .pipe(first())
      // .subscribe((data) => {
      //   this.onAddNewWidget(ev.target.id)    
      // })
      this.cellId = ev.target.id;
    }
  }

  onAddNewWidget(cellId: number = 0) {
    let id = "widget-id-" + Math.round(Math.random() * 1000000 );
    let widget = this.renderer.createElement('div')
    this.renderer.setAttribute(widget, 'id', id)
    widget.className = "widget"
    this.renderer.listen(widget, 'contextmenu', (event: any) => {
      this.openContextMenu(event)
    })

    // color //
    let red = Math.round(Math.random() * (255 - 150) + 150);
    let blue = Math.round(Math.random() * (255 - 150) + 150);
    let green = Math.round(Math.random() * (255 - 150) + 150);
    this.renderer.setStyle(widget, 'background-color', `rgb(${red}, ${green}, ${blue})`);
    ///////////

    // drag and drop ////
    this.renderer.setAttribute(widget, 'draggable', 'true');
    this.renderer.listen(widget, 'dragstart', (event) => {
      this.drag(event);
    })
    // this.renderer.listen(widget, 'drop', (event) => {
    //   this.drop(event);
    // })
    // this.renderer.listen(widget, 'dragover', (event) => {
    //   this.allowDrop(event);
    // })
    document.getElementById(this.cellId.toString())?.appendChild(widget)
  }

  //// drag and drop ////
  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev: any) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

}
