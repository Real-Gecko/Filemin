<?php
/**
 * @file
 * Class openlayers_objects_ui.
 */

/**
 * Class openlayers_objects_ui.
 */
abstract class OpenlayersObjects extends ctools_export_ui {

  /**
   * Create the filter/sort form at the top of a list of exports.
   *
   * This handles the very default conditions, and most lists are expected
   * to override this and call through to parent::list_form() in order to
   * get the base form and then modify it as necessary to add search
   * gadgets for custom fields.
   */
  public function list_form(&$form, &$form_state) {
    parent::list_form($form, $form_state);

    $form['top row'] += $form['bottom row'];

    $form['filters'] = array(
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#title' => t('Filters'),
    );

    $form['filters']['top row'] = $form['top row'];

    unset($form['bottom row']);
    unset($form['top row']);
  }

  /**
   * Provide the table header.
   *
   * If you've added columns via list_build_row() but are still using a
   * table, override this method to set up the table header.
   */
  public function list_table_header() {
    $header = array();
    if (!empty($this->plugin['export']['admin_title'])) {
      $header[] = array('data' => t('Name'), 'class' => array('ctools-export-ui-title'));
    }

    $header[] = array('data' => t('Machine name'), 'class' => array('ctools-export-ui-name'));
    $header[] = array('data' => t('Service'), 'class' => array('ctools-export-ui-service'));
    $header[] = array('data' => t('Parents'), 'class' => array('ctools-export-ui-parents'));
    $header[] = array('data' => t('Storage'), 'class' => array('ctools-export-ui-storage'));
    $header[] = array('data' => t('Operations'), 'class' => array('ctools-export-ui-operations'));

    return $header;
  }

  /**
   * Build a row based on the item.
   *
   * By default all of the rows are placed into a table by the render
   * method, so this is building up a row suitable for theme('table').
   * This doesn't have to be true if you override both.
   */
  public function list_build_row($item, &$form_state, $operations) {
    // Set up sorting.
    $name = $item->{$this->plugin['export']['key']};
    $schema = ctools_export_get_schema($this->plugin['schema']);

    list($module, $plugin) = explode('.', $item->factory_service);
    $object = openlayers_object_load($plugin, $item->machine_name);

    // Note: $item->{$schema['export']['export type string']} should have
    // already been set up by export.inc so we can use it safely.
    switch ($form_state['values']['order']) {
      case 'disabled':
        $this->sorts[$name] = empty($item->disabled) . $name;
        break;

      case 'title':
        $this->sorts[$name] = $item->{$this->plugin['export']['admin_title']};
        break;

      case 'name':
        $this->sorts[$name] = $name;
        break;

      case 'class':
        $this->sorts[$name] = $name;
        break;

      case 'storage':
        $this->sorts[$name] = $item->{$schema['export']['export type string']} . $name;
        break;
    }

    $this->rows[$name]['data'] = array();
    $this->rows[$name]['class'] = !empty($item->disabled) ? array('ctools-export-ui-disabled') : array('ctools-export-ui-enabled');

    // If we have an admin title, make it the first row.
    if (!empty($this->plugin['export']['admin_title'])) {
      $this->rows[$name]['data'][] = array('data' => check_plain($item->{$this->plugin['export']['admin_title']}), 'class' => array('ctools-export-ui-title'));
    }
    $this->rows[$name]['data'][] = array('data' => check_plain($name), 'class' => array('ctools-export-ui-name'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->factory_service), 'class' => array('ctools-export-ui-service'));
    $this->rows[$name]['data'][] = array('data' => check_plain(count($object->getParents())), 'class' => array('ctools-export-ui-parents'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->{$schema['export']['export type string']}), 'class' => array('ctools-export-ui-storage'));

    $ops = theme('links__ctools_dropbutton', array(
      'links' => $operations,
      'attributes' => array('class' => array('links', 'inline')),
    ));

    $this->rows[$name]['data'][] = array('data' => $ops, 'class' => array('ctools-export-ui-operations'));

    // Add an automatic mouseover of the description if one exists.
    if (!empty($this->plugin['export']['admin_description'])) {
      $this->rows[$name]['title'] = $item->{$this->plugin['export']['admin_description']};
    }
  }

  /**
   * Implements ctools_export_ui::edit_execute_form().
   *
   * This is hacky, but since CTools Export UI uses drupal_goto() we have to
   * effectively change the plugin to modify the redirect path dynamically.
   */
  public function edit_execute_form(&$form_state) {
    $output = parent::edit_execute_form($form_state);
    if (!empty($form_state['executed'])) {
      if ($form_state['clicked_button']['#name'] == 'saveandedit') {
        // We always want to redirect back to this page when adding an item,
        // but we want to preserve the destination so we can be redirected back
        // to where we came from after clicking "Save".
        $options = array();
        if (!empty($_GET['destination'])) {
          $options['query']['destination'] = $_GET['destination'];
          unset($_GET['destination']);
        }

        // Sets redirect path and options.
        $op = $form_state['op'];
        $path = ('add' != $op) ? current_path() : 'admin/structure/openlayers/' . $this->plugin['menu']['menu item'] . '/list/' . $form_state['item']->machine_name . '/edit/start';
        $this->plugin['redirect'][$op] = array($path, $options);
      }
    }
    return $output;
  }
}

/**
 * Wizard wrapper to add Save & edit button.
 */
function openlayers_objects_ui_form_wrapper($form, $form_state) {
  $form['buttons']['saveandedit'] = array(
    '#name' => 'saveandedit',
    '#type' => 'submit',
    '#value' => t('Save & edit'),
    '#wizard type' => 'finish',
    '#weight' => 1,
  );
  $form['buttons']['cancel']['#weight'] = 20;
  return $form;
}
