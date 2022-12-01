import * as _ from "lodash";


export function get_scatter_plot(objectives, plot_designs, plot_traces, objective_axis) {



    // --> Scatter-plots can handle up to 3 objectives (for now)
    let traces = split_into_traces(plot_designs);
    let filtered_traces = filter_traces(traces, plot_traces);


    if(objectives.length === 1){
        return scatter1d_plot(objectives, filtered_traces);
    }
    else if(objectives.length === 2){
        return scatter2d_plot(objectives, filtered_traces);
    }
    else if(objectives.length === 3){
        return scatter3d_plot(objectives, filtered_traces);
    }
    else{
        return { data: [], layout: {} }
    }
}



// --------------
// --- TRACES ---
// --------------

function split_into_traces(plot_designs){
    let trace_library = {};
    for(let x = 0; x < plot_designs.length; x++){
        let design = plot_designs[x];
        let trace_name = design['origin'];
        if(!(trace_name in trace_library)){
            trace_library[trace_name] = [];
        }
        trace_library[trace_name].push(design);
    }
    return trace_library;
}

function filter_traces(all_traces, plot_traces){
    let filtered_traces = {};
    for(let key in all_traces){
        if(plot_traces.includes(key)){
            filtered_traces[key] = all_traces[key];
        }
    }
    return filtered_traces;
}





function scatter1d_plot(objectives, traces){


    // --> 1. Create Traces
    let trace_list = [];
    for (let trace_key of Object.keys(traces)){
        let trace_data = traces[trace_key];
        let trace_build = {type:'scatter', mode:'markers', marker: {color: 'blue', size: 12}, name: trace_key};
        trace_build.x = get_axis_data(trace_data, objectives[0].id);
        trace_build.y = [];
        for(let x = 0; x < trace_build.x.length; x++){
            trace_build.y.push(0);
        }
        trace_build = integrate_trace_customdata(trace_build, trace_data, trace_key);
        trace_list.push(trace_build);
    }


    // --> 2. Create layout / scene
    let layout = {
        title: '1D Scatter',
        autosize: true,
        hovermode:'closest',
        showlegend: true,
        legend: {
            itemclick: false,
            itemdoubleclick: false
        },
        uirevision: true,
        xaxis: { title: objectives[0]['name'], gridcolor: "#ebf0f8", zerolinecolor: "#ebf0f8" },
        yaxis: { title: '', gridcolor: "#ebf0f8", zerolinecolor: "#ebf0f8" },
        plot_bgcolor:"#ffffff",
        paper_bgcolor:"#ffffff",
    }

    return {
        data: trace_list,
        layout: layout
    }
}

function scatter2d_plot(objectives, traces){

    // --> 1. Create Traces
    let trace_list = [];
    for (let trace_key of Object.keys(traces)){
        let trace_data = traces[trace_key];
        let trace_build = {type:'scatter2d', mode:'markers', marker: {color: 'blue', size: 12}, name: trace_key};
        trace_build.x = get_axis_data(trace_data, objectives[0].id);
        trace_build.y = get_axis_data(trace_data, objectives[1].id);
        trace_build = integrate_trace_customdata(trace_build, trace_data, trace_key);
        trace_list.push(trace_build);
    }


    // --> 2. Create layout
    let layout = {
        title: '2D Scatter',
        autosize: true,
        hovermode:'closest',
        showlegend: true,
        legend: {
            itemclick: false,
            itemdoubleclick: false
        },
        uirevision: true,
        xaxis: { title: objectives[0]['name'], gridcolor: "#ebf0f8", zerolinecolor: "#ebf0f8" },
        yaxis: { title: objectives[1]['name'], gridcolor: "#ebf0f8", zerolinecolor: "#ebf0f8" },
        plot_bgcolor:"#ffffff",
        paper_bgcolor:"#ffffff",
        hoverlabel: {
            bgcolor: 'white'
        }
    }
    return {
        data: trace_list,
        layout: layout
    }
}

function scatter3d_plot(objectives, traces){


    // --> 1. Create Traces
    let trace_list = [];
    for (let trace_key of Object.keys(traces)){
        let trace_data = traces[trace_key];
        let trace_build = {type:'scatter3d', mode:'markers', marker: {color: 'blue', size: 12}, name: trace_key};
        trace_build.x = get_axis_data(trace_data, objectives[0].id);
        trace_build.y = get_axis_data(trace_data, objectives[1].id);
        trace_build.z = get_axis_data(trace_data, objectives[2].id);
        trace_build = integrate_trace_customdata(trace_build, trace_data, trace_key);
        trace_list.push(trace_build);
    }

    // --> 4. Create layout
    let layout = {
        autosize: true,
        hovermode:'closest',
        showlegend: false,
        uirevision: true,
        scene: {
            xaxis: { title: objectives[0]['name'] },
            yaxis: { title: objectives[1]['name'] },
            zaxis: { title: objectives[2]['name'] },
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
        },
        plot_bgcolor:"#ffffff",
    }

    return {
        data: trace_list,
        layout: layout
    }
}



// ---------------
// --- HELPERS ---
// ---------------


function get_axis_data(designs_sub, objective_id){
    let axis_data = [];
    for(let x = 0; x < designs_sub.length; x++){
        let design = designs_sub[x];
        for(let y = 0; y < design.objectives.length; y++){
            if(design.objectives[y]['objective_id'] === objective_id){
                axis_data.push(design.objectives[y].value);
            }
        }
    }
    return axis_data;
}




function integrate_trace_customdata(trace, customdata, trace_key){
    let color = [];
    let size = [];
    for(let x = 0; x < customdata.length; x++){
        if(customdata[x].clicked === true){
            color.push('#ec8172');
            size.push(12);
        }
        else if(customdata[x].hovered === true){
            color.push('#f7b788');
            size.push(10);
        }
        else if(customdata[x].origin.startsWith("GA-")){
            color.push('#43d5b2');
            size.push(10);
        }
        else if(customdata[x].origin.startsWith("Engineer")){
            color.push('#cbd543');
            size.push(10);
        }
        else {
            color.push('#8993f8');
            size.push(10);
        }
    }

    trace.name = trace_key;
    trace.customdata = customdata
    trace.marker.color = color;
    trace.marker.size = size;
    return trace;
}








