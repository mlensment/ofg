<?php
$gDir = 'galleries/';

switch ($_GET['action']) {
  case 'loadGalleries':
    print json_encode(iterate());
    break;

  case 'loadImages':
    print json_encode(iterate($_GET['dir']));
    break;

  default:
    print json_encode(iterate());
    break;
}

function iterate($fDir = null, $limit = false) {
  global $gDir;
  $dir = '../../' . $gDir . $fDir;
  $filenames = array();
  $iterator = new DirectoryIterator($dir);
  $fileTypes = array('jpg', 'jpeg', 'gif', 'png');
  $i = 0;
  foreach ($iterator as $fileInfo) {
    if ($fileInfo->isDir() && !$fileInfo->isDot() && empty($fDir)) {
      if(!is_empty($fileInfo->getPath() . '/' . $fileInfo->getFileName())){
        $filenames[$i][] = $fileInfo->getFileName();
        $filenames[$i][] = end(iterate($fileInfo->getFileName(), true));
        $i++;
      }
    } else {
      if ($fileInfo->isFile() && !empty($fDir)) {
        if(in_array(strtolower(end(explode('.', $fileInfo->getFileName()))), $fileTypes)){
          $filenames[] = $fileInfo->getFileName();
          if($limit)
            break;
        }
      }
    }
  }
  return $filenames;
}

function is_empty($dir){
  $iterator = new DirectoryIterator($dir);
  $i = 0;
  foreach ($iterator as $fileInfo) {
    if(!$fileInfo->isDot() && $fileInfo->isFile()){
      $i++;
    }
    if($i > 0 )
      return false;
  }
  return true;
}

?>