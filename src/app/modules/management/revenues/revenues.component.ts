import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.scss']
})
export class RevenuesComponent implements OnInit {
  bgColor = ['#0000FF', '#154360', '#17202A', '#21618C', '#2E86C1', '#85C1E9', '#2E86C1', '#34495E', '#21618C', '#154360'];

  ageingRprt: any[];

  thirtyDays: number;
  sixtyDays: number;
  ninetyDays: number;
  hundredTwentyDays: number;
  hundredEightyDays: number;
  threeSixtyFiveDays: number;
  aboveThreeSixtyFiveDays: number;
  unallocatedBalance: number;
  netBalance: number;

  utc = new Date();
  dataDate = this.formatDate(this.utc);

  constructor(private service: ReportsService) {
    this.thirtyDays = 0;
    this.sixtyDays = 0;
    this.ninetyDays = 0;
    this.hundredTwentyDays = 0;
    this.hundredEightyDays = 0;
    this.threeSixtyFiveDays = 0;
    this.aboveThreeSixtyFiveDays = 0;
    this.unallocatedBalance = 0;
    this.netBalance = 0;
  }

  ngOnInit() {
    this.getAgeingData(this.dataDate);
  }

  getAgeingData(date: string) {
    this.service.getReceivablesAgeing(this.dataDate).subscribe((response : any) => {
      this.ageingRprt = response.recordset;
      console.log(this.ageingRprt);
      for(let i = 0; i < this.ageingRprt.length; i++){
        this.thirtyDays = this.thirtyDays + this.ageingRprt[i].M_30_DAYS;
        this.sixtyDays = this.sixtyDays + this.ageingRprt[i].M_60_DAYS;
        this.ninetyDays = this.ninetyDays + this.ageingRprt[i].M_90_DAYS;
        this.hundredTwentyDays = this.hundredTwentyDays + this.ageingRprt[i].M_120_DAYS;
        this.hundredEightyDays = this.hundredEightyDays + this.ageingRprt[i].M_180_DAYS;
        this.threeSixtyFiveDays = this.threeSixtyFiveDays + this.ageingRprt[i].M_365_DAYS;
        this.aboveThreeSixtyFiveDays = this.aboveThreeSixtyFiveDays + this.ageingRprt[i].ABOVE_365_DAYS;
        this.unallocatedBalance = this.unallocatedBalance + this.ageingRprt[i].UNALLOC_BALANCE;
        this.netBalance = this.netBalance + this.ageingRprt[i].NET_BALANCE
      }
      this.totalAgeingChart()
    });
  }

  totalAgeingChart() {
    var lbls: string[] = ["30 Days", "60 Days", "90 Days", "120 Days", "180 Days", "365 Days", "Above 365 Days", "Unallocated Balance", "Net Balance"];
    var amtData: number[] = [this.thirtyDays, this.sixtyDays, this.ninetyDays, this.hundredTwentyDays, this.hundredEightyDays, this.threeSixtyFiveDays, this.aboveThreeSixtyFiveDays, this.unallocatedBalance, this.netBalance];
    console.log(lbls);
    console.log(amtData);

    var ctx = document.getElementById('totalAgeingChart') as HTMLCanvasElement;
    var doughNutChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: lbls,
        datasets: [{
          label: '',
          data: amtData,
          backgroundColor: this.bgColor,
        }]
      },
      /*options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }*/
    });
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
}
