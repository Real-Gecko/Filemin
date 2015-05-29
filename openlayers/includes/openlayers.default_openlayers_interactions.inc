<?php
/**
 * @file
 * Provide default interactions.
 */

/**
 * Implements hook_default_interactions().
 */
function openlayers_default_openlayers_interactions() {
  $export = array();

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_doubleclickzoom';
  $ol_interaction->name = 'DoubleClickZoom';
  $ol_interaction->description = 'DoubleClickZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DoubleClickZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_doubleclickzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_draganddrop';
  $ol_interaction->name = 'DragAndDrop';
  $ol_interaction->description = 'DragAndDrop interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragAndDrop';
  $ol_interaction->options = array();
  $export['openlayers_interaction_draganddrop'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_dragbox';
  $ol_interaction->name = 'DragBox';
  $ol_interaction->description = 'DragBox interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragBox';
  $ol_interaction->options = array();
  $export['openlayers_interaction_dragbox'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_dragpan';
  $ol_interaction->name = 'DragPan';
  $ol_interaction->description = 'DragPan interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragPan';
  $ol_interaction->options = array(
    'decay' => -0.005,
    'minVelocity' => 0.05,
    'delay' => 100,
  );
  $export['openlayers_interaction_dragpan'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_dragrotate';
  $ol_interaction->name = 'DragRotate';
  $ol_interaction->description = 'DragRotate interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragRotate';
  $ol_interaction->options = array();
  $export['openlayers_interaction_dragrotate'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_dragrotateandzoom';
  $ol_interaction->name = 'DragRotateAndZoom';
  $ol_interaction->description = 'DragRotateAndZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragRotateAndZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_dragrotateandzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_dragzoom';
  $ol_interaction->name = 'DragZoom';
  $ol_interaction->description = 'DragZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.DragZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_dragzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_draw';
  $ol_interaction->name = 'Draw';
  $ol_interaction->description = 'Draw interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.Draw';
  $ol_interaction->options = array();
  $export['openlayers_interaction_draw'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_keyboardpan';
  $ol_interaction->name = 'KeyboardPan';
  $ol_interaction->description = 'KeyboardPan interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.KeyboardPan';
  $ol_interaction->options = array();
  $export['openlayers_interaction_keyboardpan'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_keyboardzoom';
  $ol_interaction->name = 'KeyboardZoom';
  $ol_interaction->description = 'KeyboardZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.KeyboardZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_keyboardzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_modify';
  $ol_interaction->name = 'Modify';
  $ol_interaction->description = 'Modify interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.Modify';
  $ol_interaction->options = array();
  $export['openlayers_interaction_modify'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_mousewheelzoom';
  $ol_interaction->name = 'MouseWheelZoom';
  $ol_interaction->description = 'MouseWheelZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.MouseWheelZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_mousewheelzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_pinchrotate';
  $ol_interaction->name = 'PinchRotate';
  $ol_interaction->description = 'PinchRotate interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.PinchRotate';
  $ol_interaction->options = array();
  $export['openlayers_interaction_pinchrotate'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_pinchzoom';
  $ol_interaction->name = 'PinchZoom';
  $ol_interaction->description = 'PinchZoom interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.PinchZoom';
  $ol_interaction->options = array();
  $export['openlayers_interaction_pinchzoom'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_pointer';
  $ol_interaction->name = 'Pointer';
  $ol_interaction->description = 'Pointer interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.Pointer';
  $ol_interaction->options = array();
  $export['openlayers_interaction_pointer'] = $ol_interaction;

  $ol_interaction = new stdClass();
  $ol_interaction->api_version = 1;
  $ol_interaction->machine_name = 'openlayers_interaction_select';
  $ol_interaction->name = 'Select';
  $ol_interaction->description = 'Select interaction description';
  $ol_interaction->factory_service = 'openlayers.interaction.internal.Select';
  $ol_interaction->options = array();
  $export['openlayers_interaction_select'] = $ol_interaction;

  return $export;
}
