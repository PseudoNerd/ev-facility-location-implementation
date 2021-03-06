"""
Basic mapping to the facility location problem.
Assumes the following format:
{
"facilities:" [{"lat": float, "long": float}],
"clients": [{"lat": float, "long": float}]
}
"""

import csv
import json
from multiprocessing import Pool
from cost_gen import get_fcost, get_ccost
from common.helpers import get_map_distance

def process_input(datafiles):
    """
    Convert json and csv files to an array of dicts for cost generation.
    """
    if 'json' in datafiles:
        return json.loads(datafiles['json'].read())
    elif 'csvfacility' in datafiles and 'csvclient' in datafiles:
        out = {'facilities': list(csv.DictReader(datafiles['csvfacility'])),
               'clients': list(csv.DictReader(datafiles['csvclient']))}

        if 'csvpower' in datafiles:
            out['powerlines'] = list(csv.DictReader(datafiles['csvpower']))

        return out
    else:
        return None

def make_mapping(data, facility_func, client_func,
                 use_dummy=True, use_time_dist=False):
    """
    Makes a mapping to the facility location problem using
    filename (json file with specified schema)
    facility_func (function from facility to facility cost)
    client_func (function from (client, facility) to client cost)
    """
    pool = Pool()
    if use_dummy:
        data['facilities'].append({'dummy': True})

    if use_time_dist:
        get_map_distance(data)

    # Create async tasks to get costs
    fac_costs = pool.map_async(facility_func, data['facilities'])
    for index, fac in enumerate(data['facilities']):
        fac['index'] = index

    client_costs = []
    for index, client in enumerate(data['clients']):
        client['index'] = index

        client_costs.append([pool.apply_async(client_func, (client, facility))
                             for facility in data['facilities']])

    # Get results of async tasks and assign to cost vars
    fac_costs = fac_costs.get()
    for facility, cost in zip(data['facilities'], fac_costs):
        facility['cost'] = cost

    for client, costs in zip(data['clients'], client_costs):
        client['costs'] = [cost.get() for cost in costs]

    pool.close()
    pool.join()
