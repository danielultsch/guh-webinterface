/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2016 Daniel Ultsch <daniel.ultsch@guh.io>                             *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


(function() {
  'use strict';

  angular
    .module('guh.components')
    .controller('DiagramCtrl', DiagramCtrl);

  DiagramCtrl.$inject = ['$log', '$element'];

  /**
   * @ngdoc controller
   * @name guh.containers.controller:DiagramCtrl
   * @description Presentational component to show a diagram.
   *
   */
  function DiagramCtrl($log, $element) {

    var vm = this;
    vm.$onInit = $onInit;
    vm.$postLink = $postLink;
    vm.$onChanges = $onChanges;
    vm.refetch = refetch;

    // vm.xAxis;
    // vm.yAxis;
    // vm.areaGrid;
    // vm.areaPV;

    function $onInit() {
      $log.log("Hello Diagram", vm.logEntries, vm);
    }

    function $postLink() {
      $log.log("post Link", vm.logEntries);
      _refresh();
    }

    function _refresh() {

      // vm.logEntries = {
      //   '00:00': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '00:00',
      //       energy: 30
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '00:00',
      //       energy: 70
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '00:00',
      //       energy: 100
      //     }
      //   },
      //   '00:15': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '00:15',
      //       energy: 35
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '00:15',
      //       energy: 65
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '00:15',
      //       energy: 100
      //     }
      //   },
      //   '00:30': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '00:30',
      //       energy: 50
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '00:30',
      //       energy: 70
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '00:30',
      //       energy: 120
      //     }
      //   },
      //   '00:45': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '00:45',
      //       energy: 30
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '00:45',
      //       energy: 20
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '00:45',
      //       energy: 50
      //     }
      //   },
      //   '01:00': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '01:00',
      //       energy: 30
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '01:00',
      //       energy: 80
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '01:00',
      //       energy: 110
      //     }
      //   },
      //   '01:15': {
      //     '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}': {
      //       id: '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}',
      //       time: '01:15',
      //       energy: 30
      //     },
      //     '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}': {
      //       id: '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}',
      //       time: '01:15',
      //       energy: 70
      //     },
      //     '{d5e0f05f-119f-4f43-971e-f6f3cc800686}': {
      //       id: '{d5e0f05f-119f-4f43-971e-f6f3cc800686}',
      //       time: '01:15',
      //       energy: 100
      //     }
      //   }
      // };

      $log.log("refresh diagram", vm.logEntries);

      if(!vm.logEntries || vm.logEntries.length == 0) {
        $log.log("no log entries", vm.logEntries);
        return;
      }

      var svg = d3.select($element[0]).select("svg");
      var margin = {top: 20, right: 80, bottom: 30, left: 50};
      var width = svg.attr("width") - margin.left - margin.right;
      var height = svg.attr("height") - margin.top - margin.bottom;
      d3.selectAll("g").remove();
      var graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // scale styles
      vm.xAxis = d3.scaleTime()
        .rangeRound([0, width]);

      vm.yAxis = d3.scaleLinear()
        .rangeRound([height, 0]);

      vm.areaECar = d3.area()
        .x(function(d) {
          return vm.xAxis(d.date);
        })
        .y1(function(d) {
          return vm.yAxis(d.ecar_energy);
        });

      vm.areaGrid = d3.area()
        .x(function(d) {
          return vm.xAxis(d.date);
        })
        .y1(function(d) {
          return vm.yAxis(d.ecar_energy + d.grid_energy);
        });

      vm.areaPV = d3.area()
        .x(function(d) {
          return vm.xAxis(d.date);
        })
        .y1(function(d) {
          // stacked on top of grid
          return vm.yAxis(d.ecar_energy + d.grid_energy + d.pv_energy);
        });

      // var z = d3.scaleOrdinal(d3.schemeCategory10);

      vm.line = d3.line()
        .x(function(d) {
          return vm.xAxis(d.date);
        })
        .y(function(d) {
          return d.total_energy;
        })
        .curve(d3.curveCardinal.tension(0.5));

      var groupedData = []

      var previousTime;
      var runningDate;

      for(var key in vm.logEntries) {
        var state = vm.logEntries[key];
        $log.log(state);

        // $log.log('previousTime before', previousTime);
        // $log.log('vm.runningDate before', vm.runningDate);
        // if(runningDate) {
        //   var timeDiff = 900000;
        //   $log.log('time diff', timeDiff);
        //   runningDate.setTime(runningDate.getTime() + timeDiff);
        // } else {
        //   runningDate = new Date('2017-02-09T' + state.time + ':00+00:00');
        // }
        // previousTime = state.time;
        // $log.log('previousTime after', previousTime);
        // $log.log('vm.runningDate after', vm.runningDate);

        groupedData.push({
          date: new Date(state.time),
          grid_energy: +state.grid_energy,
          pv_energy: +state.pv_energy,
          ecar_energy: +state.ecar_energy,
          total_energy: +state.total_energy
        });
      }
      const DATA_LENGTH = 4 * 12;
      if(groupedData.length > DATA_LENGTH) {
        groupedData = groupedData.slice(groupedData.length - DATA_LENGTH, groupedData.length);
      }
      $log.log("grouped1 data: ", angular.toJson(groupedData));

      vm.xAxis.domain(d3.extent(groupedData, function(d) {
        return d.date;
      }));

      vm.yAxis.domain([
        0,
        d3.max(groupedData, function(c) {
          return c.total_energy
        })
      ]);

      vm.areaECar.y0(function(d) {
        return vm.yAxis(0);
      })
        .curve(d3.curveCardinal.tension(0.5));

      vm.areaGrid
        .y0(function(d) {
          return vm.yAxis(d.ecar_energy);
        })
        .curve(d3.curveCardinal.tension(0.5));

      vm.areaPV
        .y0(function(d) {
          return vm.yAxis(d.ecar_energy + d.grid_energy);
        })
        .curve(d3.curveCardinal.tension(0.5));

      graph.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "rgb(110,110,110)")
        .call(d3.axisBottom(vm.xAxis));

      graph.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(vm.yAxis))
        .append("text")
        .attr("fill", "rgb(110,110,110)")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Energy (kWh)");

      $log.log("grouped2 data: ", angular.toJson(groupedData));

      graph.append("path")
        .datum(groupedData)
        .attr("fill", "rgb(154,202,94)")
        .attr("stroke", "rgb(81,81,81)")
        .attr("stroke-width", 0.5)
        .attr("d", vm.areaECar);

      graph.append("path")
        .datum(groupedData)
        .attr("fill", "rgb(154,202,94)")
        .attr("stroke", "rgb(81,81,81)")
        .attr("stroke-width", 0.5)
        .attr("d", vm.areaPV);

      graph.append("path")
        .datum(groupedData)
        .attr("fill", "rgb(205,53,84)")
        .attr("stroke", "rgb(81,81,81)")
        .attr("stroke-width", 0.5)
        .attr("d", vm.areaGrid);

      graph.append("path")
        .datum(groupedData)
        .attr("fill", "none")
        .attr("stroke", "rgb(81,81,81)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", function(d) {
          return vm.line(d);
        });

      $log.log("grouped data: ", groupedData);

      $log.log("refresh finished!");

    }

    function $onChanges(changesObj) {
      $log.log("Change Diagram", vm.logEntries, changesObj, changesObj.logEntries.isFirstChange());
      _refresh();
    }

    function refetch() {
      $log.log("before refetch Diagram", vm.logEntries);
      vm.onRefetch();
      $log.log("after refetch Diagram", vm.logEntries);
    }
  }

}());
