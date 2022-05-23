import h5py
if not h5py.is_hdf5('models_model_2.h5'):
    raise ValueError('Not an hdf5 file')
else:
    print('ok')    

