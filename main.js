require("js/utility/math_extension");
require("js/utility/helper");
require("js/utility/game_object");
require("js/utility/state_manager");
require("js/utility/broadcaster");
require("js/utility/mouse_area");
require("js/utility/gui_number");

require("js/menu/menu_state");
require("js/level/level_state");

Game.Initialise = function()
{
	ContentManager.load("texture", "textures/misc/number_strip.png");
	ContentManager.load("shader", "shaders/number.fx");
	
	Game.setName("Tiny Quest");
	RenderSettings.setResolution(640,480);
	RenderSettings.setVsync(false);
	RenderSettings.setFullscreen(false);
	RenderSettings.setCullMode(RenderSettings.CullNone);
	RenderSettings.setBackBufferColour(0,0,0,1);
	RenderSettings.setWindowSize(640,480);

	StateManager.switchState(MenuState);
}
Game.Update = function(dt)
{	
	if(Keyboard.isReleased("F9"))
	{
		Game.showConsole();
	}

	MouseEventManager.check();
	StateManager.update(dt);
}

Game.Draw = function(dt)
{
	StateManager.draw(dt);
}

Game.Shutdown = function()
{
		
}

Game.OnReload = function()
{
	StateManager.reload()
}
