import FolderIcon from "@/components/FolderIcon";
import React from "react";

interface Scene {
  name: string;
  shots: { name: string }[];
}

/**
 * Generates the directory structure for an Editor artist
 */
export function generateEditorStructure(): React.ReactNode {
  return (
    <>
      <li>
        <div className="flex items-center py-1">
          <FolderIcon color="scene" />
          <span className="text-sm">/timeline</span>
        </div>
        <ul className="list-none pl-5">
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="source" />
              <span className="text-sm">/software</span>
            </div>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="source" />
              <span className="text-sm">/source</span>
            </div>
            <ul className="list-none pl-5">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/footage</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/videos</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/images</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/vfx_imports</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/cgi_imports</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/motion_imports</span>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/audio</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/mix</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/music</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/sfx</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/vo</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="work" />
              <span className="text-sm">/references</span>
            </div>
          </li>
        </ul>
      </li>
      <li>
        <div className="flex items-center py-1">
          <FolderIcon color="project" />
          <span className="text-sm">/output</span>
        </div>
        <ul className="list-none pl-5">
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="scene" />
              <span className="text-sm">/wip</span>
            </div>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="scene" />
              <span className="text-sm">/publish</span>
            </div>
          </li>
        </ul>
      </li>
    </>
  );
}

/**
 * Generates the directory structure for a Motion artist
 * 
 * @param scenes - Array of scene objects with name and shots
 */
export function generateMotionStructure(scenes: Scene[]): React.ReactNode {
  const hasScenes = scenes.some(scene => scene.name);

  if (!hasScenes) {
    return (
      <li>
        <div className="flex items-center py-1">
          <FolderIcon color="scene" />
          <span className="text-sm">/scene_name</span>
        </div>
        <ul className="list-none pl-5">
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="source" />
              <span className="text-sm">/software</span>
            </div>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="source" />
              <span className="text-sm">/source</span>
            </div>
            <ul className="list-none pl-5">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/footage</span>
                </div>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/graphics</span>
                </div>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/audio</span>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="work" />
              <span className="text-sm">/references</span>
            </div>
          </li>
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="project" />
              <span className="text-sm">/output</span>
            </div>
            <ul className="list-none pl-5">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="scene" />
                  <span className="text-sm">/wip</span>
                </div>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="scene" />
                  <span className="text-sm">/publish</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    );
  } else {
    return (
      <>
        {scenes.map((scene, index) => {
          if (!scene.name) return null;
          
          return (
            <li key={index}>
              <div className="flex items-center py-1">
                <FolderIcon color="scene" />
                <span className="text-sm">/{scene.name}</span>
              </div>
              <ul className="list-none pl-5">
                <li>
                  <div className="flex items-center py-1">
                    <FolderIcon color="source" />
                    <span className="text-sm">/software</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center py-1">
                    <FolderIcon color="source" />
                    <span className="text-sm">/source</span>
                  </div>
                  <ul className="list-none pl-5">
                    <li>
                      <div className="flex items-center py-1">
                        <FolderIcon color="work" />
                        <span className="text-sm">/footage</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center py-1">
                        <FolderIcon color="work" />
                        <span className="text-sm">/graphics</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center py-1">
                        <FolderIcon color="work" />
                        <span className="text-sm">/audio</span>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="flex items-center py-1">
                    <FolderIcon color="work" />
                    <span className="text-sm">/references</span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center py-1">
                    <FolderIcon color="project" />
                    <span className="text-sm">/output</span>
                  </div>
                  <ul className="list-none pl-5">
                    <li>
                      <div className="flex items-center py-1">
                        <FolderIcon color="scene" />
                        <span className="text-sm">/wip</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center py-1">
                        <FolderIcon color="scene" />
                        <span className="text-sm">/publish</span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          );
        })}
      </>
    );
  }
}

/**
 * Generates the directory structure for a CG Artist
 * 
 * @param scenes - Array of scene objects with name and shots
 */
export function generateCGStructure(scenes: Scene[]): React.ReactNode {
  const hasScenes = scenes.some(scene => scene.name);

  if (!hasScenes) {
    return (
      <li>
        <div className="flex items-center py-1">
          <FolderIcon color="scene" />
          <span className="text-sm">/scene_name</span>
        </div>
        <ul className="list-none pl-5">
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="project" />
              <span className="text-sm">/shot_name</span>
            </div>
            <ul className="list-none pl-5">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="username" />
                  <span className="text-sm">/software</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/source</span>
                    </div>
                    <ul className="list-none pl-5">
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/models</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/animations</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/other</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/output</span>
                    </div>
                    <ul className="list-none pl-5">
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/wip</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/publish</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/references</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    );
  } else {
    return (
      <>
        {scenes.map((scene, sceneIndex) => {
          if (!scene.name) return null;
          
          const hasShots = scene.shots?.some(shot => shot.name);
          
          return (
            <li key={sceneIndex}>
              <div className="flex items-center py-1">
                <FolderIcon color="scene" />
                <span className="text-sm">/{scene.name}</span>
              </div>
              <ul className="list-none pl-5">
                {!hasShots ? (
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="project" />
                      <span className="text-sm">/shot_name</span>
                    </div>
                    <ul className="list-none pl-5">
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="username" />
                          <span className="text-sm">/software</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/source</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/models</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/animations</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/other</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/output</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/wip</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/publish</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="work" />
                          <span className="text-sm">/references</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                ) : (
                  scene.shots?.map((shot, shotIndex) => {
                    if (!shot.name) return null;
                    
                    return (
                      <li key={shotIndex}>
                        <div className="flex items-center py-1">
                          <FolderIcon color="project" />
                          <span className="text-sm">/{shot.name}</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="username" />
                              <span className="text-sm">/software</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="work" />
                                  <span className="text-sm">/source</span>
                                </div>
                                <ul className="list-none pl-5">
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/models</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/animations</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/other</span>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="work" />
                                  <span className="text-sm">/output</span>
                                </div>
                                <ul className="list-none pl-5">
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/wip</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/publish</span>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/references</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    );
                  })
                )}
              </ul>
            </li>
          );
        })}
      </>
    );
  }
}

/**
 * Generates the directory structure for a VFX Artist
 * 
 * @param scenes - Array of scene objects with name and shots
 */
export function generateVFXStructure(scenes: Scene[]): React.ReactNode {
  const hasScenes = scenes.some(scene => scene.name);

  if (!hasScenes) {
    return (
      <li>
        <div className="flex items-center py-1">
          <FolderIcon color="scene" />
          <span className="text-sm">/scene_name</span>
        </div>
        <ul className="list-none pl-5">
          <li>
            <div className="flex items-center py-1">
              <FolderIcon color="project" />
              <span className="text-sm">/shot_name</span>
            </div>
            <ul className="list-none pl-5">
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="username" />
                  <span className="text-sm">/data</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/raw</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/onset</span>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="username" />
                  <span className="text-sm">/software</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="work" />
                      <span className="text-sm">/source</span>
                    </div>
                    <ul className="list-none pl-5">
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/ext</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/cleanup</span>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="scene" />
                          <span className="text-sm">/other</span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <div className="flex items-center py-1">
                  <FolderIcon color="work" />
                  <span className="text-sm">/output</span>
                </div>
                <ul className="list-none pl-5">
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/wip</span>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="scene" />
                      <span className="text-sm">/publish</span>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    );
  } else {
    return (
      <>
        {scenes.map((scene, sceneIndex) => {
          if (!scene.name) return null;
          
          const hasShots = scene.shots?.some(shot => shot.name);
          
          return (
            <li key={sceneIndex}>
              <div className="flex items-center py-1">
                <FolderIcon color="scene" />
                <span className="text-sm">/{scene.name}</span>
              </div>
              <ul className="list-none pl-5">
                {!hasShots ? (
                  <li>
                    <div className="flex items-center py-1">
                      <FolderIcon color="project" />
                      <span className="text-sm">/shot_name</span>
                    </div>
                    <ul className="list-none pl-5">
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="username" />
                          <span className="text-sm">/data</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/raw</span>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/onset</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="username" />
                          <span className="text-sm">/software</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/source</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/ext</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/cleanup</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/other</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="flex items-center py-1">
                          <FolderIcon color="work" />
                          <span className="text-sm">/output</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="scene" />
                              <span className="text-sm">/wip</span>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="scene" />
                              <span className="text-sm">/publish</span>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                ) : (
                  scene.shots?.map((shot, shotIndex) => {
                    if (!shot.name) return null;
                    
                    return (
                      <li key={shotIndex}>
                        <div className="flex items-center py-1">
                          <FolderIcon color="project" />
                          <span className="text-sm">/{shot.name}</span>
                        </div>
                        <ul className="list-none pl-5">
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="username" />
                              <span className="text-sm">/data</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="work" />
                                  <span className="text-sm">/raw</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="work" />
                                  <span className="text-sm">/onset</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="username" />
                              <span className="text-sm">/software</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="work" />
                                  <span className="text-sm">/source</span>
                                </div>
                                <ul className="list-none pl-5">
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/ext</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/cleanup</span>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="flex items-center py-1">
                                      <FolderIcon color="scene" />
                                      <span className="text-sm">/other</span>
                                    </div>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <div className="flex items-center py-1">
                              <FolderIcon color="work" />
                              <span className="text-sm">/output</span>
                            </div>
                            <ul className="list-none pl-5">
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/wip</span>
                                </div>
                              </li>
                              <li>
                                <div className="flex items-center py-1">
                                  <FolderIcon color="scene" />
                                  <span className="text-sm">/publish</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    );
                  })
                )}
              </ul>
            </li>
          );
        })}
      </>
    );
  }
}
