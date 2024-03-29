// Scan Result Chart Setup

var scan_chart_spectra;
var scan_chart_peaks;
var scan_chart_threshold;
var scan_chart_obj;
var scan_chart_latest_timestamp_utc;
var scan_chart_latest_timestamp_local;
var scan_chart_last_drawn = "none";

function setup_scan_chart(){
	scan_chart_spectra = {
	    xs: {
	        'Spectra': 'x_spectra'
	    },
	    columns: [
	        ['x_spectra',autorx_config.min_freq, autorx_config.max_freq],
	        ['Spectra',0,0]
	    ],
	    type:'line'
	};

	scan_chart_peaks = {
	    xs: {
	        'Peaks': 'x_peaks'
	    },
	    columns: [
	        ['x_peaks',0],
	        ['Peaks',0]
	    ],
	    type:'scatter'
	};

	scan_chart_threshold = {
	    xs:{
	        'Threshold': 'x_thresh'
	    },
	    columns:[
	        ['x_thresh',autorx_config.min_freq, autorx_config.max_freq],
	        ['Threshold',autorx_config.snr_threshold,autorx_config.snr_threshold]
	    ],
	    type:'line'
	};

	scan_chart_obj = c3.generate({
	    bindto: '#scan_chart',
	    data: scan_chart_spectra,
        tooltip: {
            format: {
                title: function (d) { return (Math.round(d * 1000) / 1000) + " MHz"; },
                value: function (value) { return value + " dB"; }
            }
        },
	    axis:{
	        x:{
	            tick:{
                    culling: {
                        max: window.innerWidth > 1100 ? 10 : 4
                    },
	                format: function (x) { return x.toFixed(3); }
	            },
	            label:"Frequency (MHz)"
	        },
	        y:{
	            label:"Power (dB - Uncalibrated)"
	        }
	    },
	    point:{r:10}
	});
}

function redraw_scan_chart(){
	// Plot the updated data.
	if(scan_chart_last_drawn === scan_chart_latest_timestamp_utc){
		// No need to re-draw.
		//console.log("No need to re-draw.");
		return;
	}
	scan_chart_obj.load(scan_chart_spectra);
	scan_chart_obj.load(scan_chart_peaks);
	scan_chart_obj.load(scan_chart_threshold);

	scan_chart_last_drawn = scan_chart_latest_timestamp_utc;

	//console.log("Scan plot redraw - " + scan_chart_latest_timestamp_utc);

	// Run dark mode check again to solve render issues.
	var z = getCookie('dark');
		if (z == 'true') {
			changeTheme(true);
		} else if (z == 'false') {
			changeTheme(false);
		} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			changeTheme(true);
		} else {
			changeTheme(false);
		}

	// Show the latest scan time.
	var timestamp = (getCookie('UTC') == 'false') ? scan_chart_latest_timestamp_local : scan_chart_latest_timestamp_utc;
	$('#scan_results').html('<b>Latest Scan:</b> ' + timestamp);
}
