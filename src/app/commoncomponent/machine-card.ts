import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-machinecard',
  template: `
  <div class="p-2">
    <div *ngIf="machineData">
      <div class="d-flex justify-content-between mt-5">
        <div style="display: flex;gap: 22.684px;">
          <p
            style="color:8C8DA8; cursor: pointer;"
            (click)="filterByStatus('all')"
          >
            All <span class="total">{{ statusCounts.total }}</span>
          </p>
          <p
            style="color:8C8DA8; cursor: pointer;"
            (click)="filterByStatus('stop')"
          >
            Stopped
            <span class="stopped">{{ statusCounts.stop }}</span>
          </p>
          <p
            style="color:8C8DA8; cursor: pointer;"
            (click)="filterByStatus('running')"
          >
            Running
            <span class="running">{{ statusCounts.running }}</span>
          </p>
          <p
            style="color:8C8DA8; cursor: pointer;"
            (click)="filterByStatus('ideal')"
          >
            Unplanned
            <span class="Unplanned">{{ statusCounts.ideal }}</span>
          </p>
        </div>
        <div class="dropdown">
        <i
          class="fa fa-solid fa-filter"
          style="border-radius: 5.362px;border: 1.34px solid #8C8DA8;padding:5px;color:#8C8DA8;cursor:pointer;"
        ></i>
          <div class="dropdown-content">
            <a
              [ngStyle]="{
                'background-color': keyVisibility[key] ? '#ddd' : ''
              }"
              *ngFor="let key of buttonToDisplay()"
              (click)="selectParameter(key)"
              >{{ key }}</a
            >
          </div>
        </div>
      </div>
      <div class="row" style="margin-top:35px;margin-bottom:30px;margin-right:0;">
        <div
          class=" col-sm-3 col-md-4 col-lg-2"
          style="margin-bottom: 35px;"
          *ngFor="let item of filtredMachineData; let i = index"
        >
          <div class="card shadow p-1" style="height:100%">
            <div
              style="display: flex; justify-content: space-between; height: 21px;"
            >
              <div
                class="m-no"
                [ngStyle]="{
                  'background-color':
                    getStatus(item) === 'running'
                      ? '#25a77e'
                      : getStatus(item) === 'stop'
                      ? '#FF5A5A'
                      : getStatus(item) === 'ideal'
                      ? '#9C9C9C'
                      : '#000000'
                }"
              >
                {{ getMno(item) }}
              </div>
              <i class="fa fa-external-link text-decoration-none" style="margin:10px 10px 0px 0px;cursor: pointer;color:green" (click)="openPopup(i)">
              </i>
            </div>
            <div class="card-body">
              <p class="m-name">{{ getType(item) }}</p>
              <div *ngFor="let key of defaultData(item)">
                <ng-container *ngIf="!keyVisibility[key]">
                  <div class="m-title text-capitalize mt-2">{{ key }}</div>
                  <div
                    class="row mt-1"
                    *ngFor="
                      let keyValuePair of item[key] | keyvalue;
                      let mI = index
                    "
                  >
                    <ng-container *ngIf="mI === 0">
                      <div class="col-5 text-capitalize p-key">
                        {{ keyValuePair.key }}
                      </div>
                      <div class="col-7 text-capitalize p-value">
                        {{ keyValuePair.value }}
                      </div>
                    </ng-container>
                  </div>
                </ng-container>
              </div>
              <div *ngFor="let key of restOfData(item)">
                <ng-container *ngIf="keyVisibility[key]">
                  <div class="m-title text-capitalize mt-2">{{ key }}</div>
                  <div
                    class="row mt-1"
                    *ngFor="let keyValuePair of item[key] | keyvalue"
                  >
                    <div class="col-5 text-capitalize p-key">
                      {{ keyValuePair.key }}
                    </div>
                    <div class="col-7 text-capitalize p-value">
                      {{ keyValuePair.value }}
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal"
        [ngStyle]="{ display: displayStyle }"
        style="background-color: rgba(128, 128, 128, 0.5);overflow:auto;"
      >
        <div class="modal-dialog" role="document" style="max-width: 430px;">
          <div class="modal-content ">
            <div *ngFor="let data of selectedMachineData">
              <div class="modalHeader ">
                <p style="color:black">{{ getMno(data) }}</p>
                <p>{{ getType(data) }}</p>
              </div>
              <div class="row">
                <div class="modal-body">
                  <div *ngFor="let key of popUp(data)">
                    <div class="m-title text-capitalize mt-2">{{ key }}</div>
                    <div
                      class="row mt-1"
                      *ngFor="let keyValuePair of data[key] | keyvalue"
                    >
                      <div class="col-6 text-capitalize p-key">
                        {{ keyValuePair.key }}
                      </div>
                      <div class="col-6 text-capitalize p-value">
                        {{ keyValuePair.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modalFooter">
                <button
                  style="padding:4px;"
                  type="button"
                  class="btn btn-danger"
                  (click)="closePopup()"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
      .col-lg-2 {
        max-width: 211px !important;
      }
      .card {
        border-radius: 20px;
      }
      .card-body {
        padding: 10px 10px;
      }
      .m-no {
        display: flex;
        position: relative;
        bottom: 35.48px;
        left: 17.48px;
        align-items: center;
        justify-content: center;
        width: 54.788px;
        height: 54.788px;
        flex-shrink: 0;
        color: #fff;
        background-color: #25a77e;
        filter: drop-shadow(
          1.245189905166626px 2.490379810333252px 2.490379810333252px
            rgba(0, 0, 0, 0.25)
        );
        border-radius: 50%;
      }

      .m-title {
        color: black !important;
        font-size: 13.989px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 0;
      }

      .m-name {
        color: #808080;
        font-size: 11.657px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-top: 1px;
        height: 25px;
      }
      .p-key {
        color: #808080;
        font-size: 11.657px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-top: 1px;
        padding-right: 0;
      }
      .p-value {
        color: #808080;
        font-size: 11.657px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-top: 1px;
        text-align: right;
        padding-right: 17px;
        padding-left: 0px;
      }
      .hideshow {
        color: #808080;
        font-style: normal;
        font-weight: bold;
        line-height: normal;
        cursor: pointer;
        padding: 0px 7px 0px 0px;
        position: absolute;
        bottom: 17px;
        right: 11px;
      }
      .total {
        border-radius: 5.362px;
        border: 1.34px solid #6092c0;
        background: #cfdeec;
        width: 29.489px;
        height: 29.489px;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: #6092c0;
        padding: 6px;
      }

      .stopped {
        border-radius: 5.362px;
        border: 1.34px solid #ff5a5a;
        background: #ffcdcd;
        width: 29.489px;
        height: 29.489px;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: #ff5a5a;
        padding: 6px;
      }
      .running {
        border-radius: 5.362px;
        border: 1.34px solid #25a77e;
        background: #bde4d8;
        width: 29.489px;
        height: 29.489px;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: #25a77e;
        padding: 6px;
      }
      .Unplanned {
        border-radius: 5.362px;
        border: 1.34px solid #8c8da8;
        background: #dcdce4;
        width: 29.489px;
        height: 29.489px;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: #8c8da8;
        padding: 6px;
      }
      .modalHeader {
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0px 10px;
        height: 40px;
      }
      .modal-body {
        padding: 15px 35px;
      }
      .modalFooter {
        border-top: 1px solid lightgray;
        display: flex;
        justify-content: flex-end;
        padding: 5px;
      }
      .dropdown {
        position: relative;
        display: inline-block;
        margin: 3px;
        padding-right: 1%;
      }

      .dropdown-content {
        display: none;
        position: absolute;
        background-color: #fff;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
        font-size: 12px;
        font-family: 'Poppins', sans-serif;
        right: 0;
      }

      .dropdown-content a {
        color: black;
        padding: 8px 10px;
        text-decoration: none;
        display: block;
        margin: 2px;
      }

      .dropdown-content a:hover {
        background-color: #ddd;
        cursor: pointer;
      }

      .dropdown:hover .dropdown-content {
        display: block;
        border-radius: 5px;
        padding: 4px 0px 4px 0px;
        box-shadow: 0px 3px 04px 1px #888888;
      }
    `,
  ],
})
export class Machinecard {
  @Input() machineData: any = [];
  statusCounts: any;
  selectedMachineData: any[] = [];
  keyVisibility: { [key: string]: boolean } = {};
  filtredMachineData: any = [];

  ngOnChanges() {
    this.filtredMachineData = this.machineData;
    this.statusCounts = this.fetchMachineStatusCount(this.machineData);
  }

  getMno(item: any): any {
    const dynamicKey = Object.keys(item).find((key) => key.includes('mNo'));
    return dynamicKey ? item[dynamicKey] : null;
  }

  getType(item: any) {
    const dynamicKey = Object.keys(item).find((key) =>
      key.includes('machineType')
    );
    return dynamicKey ? item[dynamicKey] : null;
  }
  getStatus(item: any) {
    return item.status;
  }

  defaultData(obj: any) {
    const keys = Object.keys(obj);
    return keys.filter((key) => key.includes('Production Order'));
  }
  restOfData(data: any) {
    const relevantKeys = Object.keys(data).filter(key => 
      key.includes('Production Order') || 
      key.includes('Current Shift Time') || 
      key.includes('Current Shift Speed') || 
      key.includes('Pieces') || 
      key.includes('quantity')
    );
    return relevantKeys;
  }
  

  buttonToDisplay(): string[] {
    const excludedKeys = ['mNo', 'machineType', 'status'];
  
    const uniqueKeys = Array.from(
      new Set<string>(
        this.machineData.flatMap(
          (machineData: {}) =>
            Object.keys(machineData).filter(
              (key) => !excludedKeys.includes(key)
            ) as string[]
        )
      )
    );
  
    // Sort the keys alphabetically
    const sortedKeys = uniqueKeys.sort();
  
    return sortedKeys;
  }
  

  popUp(obj: any) {
    const keys = Object.keys(obj).filter(key =>   
      key.includes('Production Order') || 
    key.includes('Current Shift Time') || 
    key.includes('Current Shift Speed') || 
    key.includes('Pieces') || 
    key.includes('quantity'));
    return keys;
  }

  fetchMachineStatusCount(data: any[]) {
    const statusCount = data.reduce(
      (count, machine) => {
        count[machine.status] += 1;
        count.total += 1;
        return count;
      },
      { running: 0, stop: 0, ideal: 0, total: 0 }
    );
    return statusCount;
  }
  displayStyle = 'none';
  openPopup(index: any) {
    this.selectedMachineData.push(this.machineData[index]);
    this.displayStyle = 'block';
  }

  closePopup() {
    this.selectedMachineData = [];
    this.displayStyle = 'none';
  }

  selectParameter(value: any) {
    this.keyVisibility[value] = !this.keyVisibility[value];
  }

  filterByStatus(status: string): void {
    this.filtredMachineData =
      status == 'all'
        ? this.machineData
        : this.machineData.filter(
            (machine: { status: string }) => machine.status == status
          );
  }

  onRefreshClick() {}
}
