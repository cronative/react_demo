import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {Get, Put} from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import ProWalkingDetailsComponent from './proWalkingDetailsComponent';
import RNFetchBlob from 'rn-fetch-blob';
import {format} from 'date-fns';

const ProWalkinDetailsContainer = ({route, navigation}) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(null);
  const [notesData, setNotesData] = useState([]);
  const [noteEditId, setNoteEditId] = useState(null);
  const [noteEditText, setNoteEditText] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [exportingText, setExportingText] = useState('Export PDF invoice');

  const fetchData = () => {
    setLoading(true);
    Get(`pro/walkin-booking-details/${route.params?.id}`)
      .then((response) => {
        setBookingData(response.data);
        console.log('Status: ', response?.data);
        setLoading(false);
        try {
          setNotesData(JSON.parse(response.data?.note));
        } catch (error) {}
      })
      .catch((error) => {
        console.log('Fetch Error: ', error);
        global.showToast('Somethign went wrong', 'error');
        setLoading(false);
      });
  };

  const exportInvoice = () => {
    Get(`/pro/walkin-booking-invoice?id=${route.params?.id}`)
      .then((result) => {
        if (result.status === 200) {
          setExportingText('Exporting...');
          let pdfURL = result.data;

          // Initialize directry
          const dirs =
            Platform.OS == 'ios'
              ? RNFetchBlob.fs.dirs.DocumentDir
              : RNFetchBlob.fs.dirs.DownloadDir;
          console.log('dirs', dirs);
          // Configuration
          let configObj = {
            fileCache: true,
            path: Platform.OS == 'ios' ? dirs + `/invoice.pdf` : `${dirs}`,
          };

          if (Platform.OS != 'ios') {
            configObj['addAndroidDownloads'] = {
              useDownloadManager: true,
              notification: true,
              path: `${dirs}/invoiceData-${format(
                Date.now(),
                'yyyy-MM-dd-hh-mm-ss',
              )}.pdf`,
            };
          }
          RNFetchBlob.config(configObj)
            .fetch('GET', pdfURL, {})
            .then((res) => {
              console.log('The file saved to ', res.path());
              // let status = res.info().status;
              setExportingText('Export PDF invoice');
              if (res.path()) {
                global.showToast('PDF downloaded successfully', 'success');
              }
              if (Platform.OS === 'ios') {
                RNFetchBlob.ios.openDocument(res.data);
              }
            })
            .catch((e) => {
              global.showToast(
                'Something went wrong, please try after some times',
                'error',
              );
              console.trace(e);
              setExportingText('Export PDF invoice');
            });
        }
      })
      .catch((error) => {
        console.trace(error);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
        setExportingText('Export PDF invoice');
      });
  };

  const markAsComplete = () => {
    setLoading(true);
    setVisibleModal(null);
    Put(`/pro/walkin-booking-status/${route.params?.id}?range=2`, {})
      .then((response) => {
        setLoading(false);
        global.showToast('Booking completed successfully', 'success');
        fetchData();
      })
      .catch((error) => {
        console.log('Complete Error: ', error);
        setLoading(false);
        global.showToast('Something went wrong', 'error');
      });
  };

  const rescheduleBooking = () => {
    navigation.navigate('NewWalkInBooking', {
      preSelected: true,
      selectedUser: bookingData?.walkInClient?.id,
      serviceId: bookingData?.Service?.id,
      isReschedule: true,
      rescheduleId: bookingData?.id,
    });
  };

  const cancelBooking = () => {
    setLoading(true);
    setVisibleModal(null);
    Put(`/pro/walkin-booking-status/${route.params?.id}?range=3`, {})
      .then((response) => {
        setLoading(false);
        global.showToast('Booking cancelled successfully', 'success');
        fetchData();
      })
      .catch((error) => {
        console.log('Cancel Error: ', error);
        setLoading(false);
        global.showToast('Something went wrong', 'error');
      });
  };

  const reBook = () => {
    navigation.navigate('NewWalkInBooking', {
      preSelected: true,
      selectedUser: bookingData?.walkInClient?.id,
      serviceId: bookingData?.Service?.id,
    });
  };

  const constructNotesData = () => {
    //editing note
    if (!!noteEditId || noteEditId == 0) {
      let notesDataLocal = JSON.parse(JSON.stringify(notesData));
      notesDataLocal.splice(noteEditId, 1, noteEditText);
      updateNotes(notesDataLocal);
    }
    // adding new note
    else {
      updateNotes([...notesData, noteEditText]);
    }
  };

  const deleteNoteData = (noteId = selectedNoteId, type = 'afterConfirm') => {
    if (type == 'beforeConfirm') {
      setSelectedNoteId(noteId);
      setVisibleModal('DeleteNoteModal');
      return false;
    }
    //  noteId is index
    let notesDataLocal = JSON.parse(JSON.stringify(notesData));
    notesDataLocal.splice(noteId, 1);
    updateNotes(notesDataLocal);
    setVisibleModal('');
  };

  const updateNotes = async (notes) => {
    setLoading(true);
    try {
      await Put('/pro/walkin-booking-add-note', {
        notes: JSON.stringify(notes),
        reservationId: bookingData.id,
      });
      setNoteEditId(null);
      setNoteEditText(null);
      setNotesData(notes);
      global.showToast('Notes updated successfully', 'success');
    } catch (error) {
      console.log(error);
      global.showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!!route?.params?.id) {
        fetchData();
      }
    }, [route]),
  );

  return (
    <ProWalkingDetailsComponent
      bookingData={bookingData}
      loading={loading}
      fetchData={fetchData}
      markAsComplete={markAsComplete}
      rescheduleBooking={rescheduleBooking}
      cancelBooking={cancelBooking}
      reBook={reBook}
      visibleModal={visibleModal}
      setVisibleModal={setVisibleModal}
      notesData={notesData}
      noteEditId={noteEditId}
      noteEditText={noteEditText}
      setNoteEditId={setNoteEditId}
      setNoteEditText={setNoteEditText}
      deleteNoteData={deleteNoteData}
      constructNotesData={constructNotesData}
      exportInvoice={exportInvoice}
      exportingText={exportingText}
    />
  );
};

export default ProWalkinDetailsContainer;
